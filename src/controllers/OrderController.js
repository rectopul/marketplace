/* eslint-disable no-unused-vars */
const Store = require('../models/Stores')
const Order = require('../models/Order')
const Client = require('../models/Client')
const ProdutctOrder = require('../models/ProductOrder')
const UserByToken = require('../middlewares/userByToken')
const User = require('../models/User')
const Product = require('../models/Product')
const { createOrder, getOrder } = require('../modules/payment')
const { Op } = require('sequelize')
const { addToCart } = require('../modules/melhorenvio')
const Shipping = require('../models/Shipping')

const shipCompany = (type) => {
    return new Promise((res, rej) => {
        if (type == `PAC`)
            return res({
                name: `Correios`,
                number: 1,
            })
        if (type == `SEDEX`)
            return res({
                name: `Correios`,
                number: 2,
            })
        if (type == `.Package`)
            return res({
                name: `JadLog`,
                number: 3,
            })
        if (type == `.Com`)
            return res({
                name: `JadLog`,
                number: 4,
            })

        return rej({
            error: {
                name: `shippingInvalid`,
                message: `This shipping not exist in system`,
            },
        })
    })
}

module.exports = {
    async index(req, res) {
        try {
            const { order_id } = req.params
            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id, user_id } = await UserByToken(authHeader)

            //unitário
            if (order_id) {
                if (client_id) {
                    const resume = await Order.findByPk(order_id, {
                        attributes: { exclude: [`client_id`] },
                        include: [
                            {
                                association: `client`,
                                attributes: {
                                    exclude: [`password_hash`, `passwordResetToken`, `passwordResetExpires`],
                                },
                                include: { association: `delivery_addresses` },
                            },
                            {
                                association: 'products_order',
                                attributes: [`quantity`],
                                include: [
                                    {
                                        association: `product`,
                                        attributes: { exclude: [`store_id`, `stock`, `cust_price`] },
                                    },
                                    {
                                        association: `variation`,
                                        attributes: {
                                            exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`],
                                        },
                                        include: [{ association: `image` }, { association: `variation_info` }],
                                    },
                                ],
                            },
                        ],
                    })

                    const wirecard = await getOrder(resume.order)

                    return res.json({ order: resume, wirecard })
                }
            }

            //todos
            const resume = await Order.findAll({
                where: { client_id: client_id || user_id },
                attributes: { exclude: [`client_id`] },
                include: [
                    {
                        association: `client`,
                        attributes: {
                            exclude: [`password_hash`, `passwordResetToken`, `passwordResetExpires`],
                        },
                        include: { association: `delivery_addresses` },
                    },
                    {
                        association: 'products_order',
                        attributes: [`quantity`],
                        include: [
                            {
                                association: `product`,
                                attributes: { exclude: [`store_id`, `stock`, `cust_price`] },
                            },
                            {
                                association: `variation`,
                                attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                include: [{ association: `image` }, { association: `variation_info` }],
                            },
                        ],
                    },
                ],
            })

            return res.json(resume)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro listar endereço de entrega: `, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },

    async store(req, res) {
        try {
            const { product_id, quantity, variation_id, customer, shipping } = req.body

            if (!shipping) return res.status(400).send({ error: `Enter the type of shipping` })

            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id } = await UserByToken(authHeader)

            const infClient = await Client.findByPk(client_id, {
                include: { association: `delivery_addresses`, where: { active: true } },
            })

            //check wirecard account
            if (!infClient.wireId)
                return res.status(400).send({ error: `The customer does not have a payment account` })
            //check delivery address
            if (!infClient.delivery_addresses.length > 0)
                return res.status(400).send({ error: `The customer has no registered delivery address` })

            //Includes
            const includes = [
                {
                    association: `client`,
                    attributes: { exclude: [`password_hash`] },
                    include: { association: `delivery_addresses`, where: { active: true } },
                },
                {
                    association: `store`,
                    attributes: { exclude: [`user_id`, `createdAt`, `updatedAt`] },
                },
                {
                    association: `coupon`,
                },
                {
                    association: 'products_order',
                    attributes: [`quantity`],
                    include: [
                        {
                            association: `product`,
                            attributes: { exclude: [`store_id`, `stock`, `cust_price`] },
                        },
                        {
                            association: `variation`,
                            attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                            include: [{ association: `image` }, { association: `variation_info` }],
                        },
                    ],
                },
            ]

            const product = await Product.findByPk(product_id)

            if (!product) return res.status(400).send({ error: `Product not exist!` })

            //Variação de produto
            if (variation_id) {
                const variation = await Product.findByPk(product_id, {
                    include: {
                        association: `variations`,
                        where: { variation_id },
                    },
                })

                if (!variation) return res.status(400).send({ error: `Product variation not exist!` })

                const {
                    variable_sale_price,
                    variable_sale_price_dates_to,
                    variable_regular_price,
                    variable_description,
                } = variation.variations[0]

                let value = parseFloat(variable_regular_price) * quantity,
                    unitValue = parseFloat(variable_regular_price)

                //Se tiver em promoção
                if (variable_sale_price) {
                    value = parseFloat(variable_sale_price) * quantity
                    unitValue = parseFloat(variable_sale_price)
                }

                //Se a promoção tiver data
                if (variable_sale_price_dates_to < new Date()) {
                    value = parseFloat(variable_regular_price) * quantity
                    unitValue = parseFloat(variable_regular_price)
                }

                const discount = 0

                const total = value

                //MELHOR ENVIO
                //adicionar etiqueta de envio ao carrinho
                const shippingTicket = await addToCart({
                    client_id,
                    product_id,
                    variation_id,
                    store_id: product.store_id,
                    quantity,
                })

                //create order
                const order = await Order.create({
                    store_id: product.store_id,
                    client_id,
                    status: `pagamento_pendente`,
                    coupon_id: null,
                    value,
                    discount,
                    total,
                })

                //Product order
                await ProdutctOrder.create({
                    store_id: product.store_id,
                    order_id: order.id,
                    client_id,
                    product_id,
                    variation_id: variation.variations[0].id,
                    quantity,
                })

                const resume = await Order.findByPk(order.id, { include: includes })

                const shippingInfos = await shipCompany(shipping)

                //registrar envio
                const shippig = await Shipping.create({
                    order_id: order.id,
                    store_id: product.store_id,
                    client_id,
                    product_id,
                    code: shippingTicket.id,
                    companyName: shippingInfos.name,
                    companyCode: shippingInfos.number,
                    price: shippingTicket.price,
                    deliveryRangeMin: shippingTicket.delivery_min,
                    deliveryRangeMax: shippingTicket.delivery_max,
                    dimensionsHeight: parseFloat(shippingTicket.volumes[0].height),
                    dimensionsWidth: parseFloat(shippingTicket.volumes[0].width),
                    dimensionsLength: parseFloat(shippingTicket.volumes[0].length),
                    dimensionsWeight: parseFloat(shippingTicket.volumes[0].weight),
                    insuranceValue: shippingTicket.insurance_value,
                    format: shippingTicket.format,
                    variation_id: variation.variations[0].id,
                    status: shippingTicket.status,
                })

                //Wirecard
                //idWirecard da Loja
                const { wirecardId } = resume.store
                const { wireId, ownId } = resume.client

                let objetoWire = {
                    orderID: order.id,
                    customerId: wireId,
                    own_id: ownId,
                    shipping: 1500,
                    productTitle: product.title,
                    quantity,
                    detail: variable_description,
                    productPrice: parseInt((unitValue / 100).toString().replace('.', '')),
                    moipId: wirecardId,
                }

                const orderWire = await createOrder(objetoWire)

                const wireorder = orderWire.id

                await Order.update({ order: wireorder }, { where: { id: order.id } })

                const newOrder = await Order.findByPk(order.id, { include: includes })

                return res.json({ order: newOrder, wirecard: orderWire, shippingTicket, shippig })
            }

            const { promotional_price, price } = product
            const value = parseFloat(promotional_price) * quantity || parseFloat(price) * quantity
            let unitValue = parseFloat(promotional_price) || parseFloat(price)
            const discount = 0

            const total = value

            //MELHOR ENVIO
            //adicionar etiqueta de envio ao carrinho
            const shippingTicket = await addToCart({ client_id, product_id, store_id: product.store_id, quantity })

            //Create Order
            const order = await Order.create({
                store_id: product.store_id,
                client_id,
                status: `pagamento_pendente`,
                coupon_id: null,
                value,
                discount,
                total,
            })

            //Product order
            await ProdutctOrder.create({
                store_id: product.store_id,
                order_id: order.id,
                client_id,
                product_id,
                quantity,
            })

            //Resumo do pedido
            const resume = await Order.findByPk(order.id, { include: includes })

            const shippingInfos = await shipCompany(shipping)
            //registrar envio
            const shippig = await Shipping.create({
                order_id: order.id,
                store_id: product.store_id,
                client_id,
                product_id,
                code: shippingTicket.id,
                companyName: shippingInfos.name,
                companyCode: shippingInfos.number,
                price: shippingTicket.price,
                deliveryRangeMin: shippingTicket.delivery_min,
                deliveryRangeMax: shippingTicket.delivery_max,
                dimensionsHeight: parseFloat(shippingTicket.volumes[0].height),
                dimensionsWidth: parseFloat(shippingTicket.volumes[0].width),
                dimensionsLength: parseFloat(shippingTicket.volumes[0].length),
                dimensionsWeight: parseFloat(shippingTicket.volumes[0].weight),
                insuranceValue: shippingTicket.insurance_value,
                format: shippingTicket.format,
                variation_id,
                status: shippingTicket.status,
            })

            //WIRECARD
            //idWirecard da Loja
            const { wirecardId } = resume.store
            const { wireId, ownId } = resume.client

            let objetoWire = {
                orderID: order.id,
                customerId: wireId,
                own_id: ownId,
                shipping: 1500,
                productTitle: product.title,
                quantity,
                detail: product.description,
                productPrice: parseInt((unitValue / 100).toString().replace('.', '')),
                moipId: wirecardId,
            }

            const orderWire = await createOrder(objetoWire)

            const wireorder = orderWire.id

            await Order.update({ order: wireorder }, { where: { id: order.id } })

            const newOrder = await Order.findByPk(order.id, { include: includes })

            return res.json({ order: newOrder, wirecard: orderWire, shippingTicket, shippig })
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `wireOrderError` ||
                error.name == `bestSubmissionError` ||
                error.name == `StatusCodeError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar pedido: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    //Adm
    async admIndex(req, res) {
        try {
            const { order_id, store_id } = req.params
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const user = await User.findByPk(user_id)

            //filters = store / date / order / limit
            const { limit, order, date, name, email, cpf, status } = req.query

            //pesquisa por cliente
            let where = {}

            if (name) where.name = name

            if (email) where.email = email

            if (cpf) where.cpf = cpf

            const includes = {
                association: 'products_order',
                attributes: [`quantity`],
                include: [
                    {
                        association: `product`,
                        attributes: { exclude: [`store_id`, `stock`, `cust_price`] },
                    },
                    {
                        association: `variation`,
                        attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                        include: [{ association: `image` }, { association: `variation_info` }],
                    },
                ],
            }

            //consult by client
            if (name || email || cpf) {
                const order = await Order.findAll({
                    include: [
                        {
                            association: `client`,
                            attributes: {
                                exclude: [
                                    `password_hash`,
                                    `passwordResetToken`,
                                    `passwordResetExpires`,
                                    `wireId`,
                                    `ownId`,
                                ],
                            },
                            where: where,
                        },
                        includes,
                    ],
                })

                return res.json(order)
            }

            //mount query filter
            let filter = {}

            //com limitador
            if (limit) filter.limit = limit

            let whereFilter = { store_id }

            //order
            if (order) filter.order = [`id`, order]
            //date
            if (date) {
                const to = `${date[0]} 00:00:00.000+00`
                const from = `${date[1]} 23:59:28.516+00`
                filter.date = { store_id, createdAt: { [Op.between]: [to, from] } }

                whereFilter.createdAt = { [Op.between]: [to, from] }
            }

            if (status) whereFilter.status = status

            if (order_id) {
                //unitário
                //manager / adm
                if (user.type == `storeAdministrator`) {
                    //only get in administrator store

                    //get all stores from administrator
                    const store = await Store.findOne({ where: { id: store_id, user_id } })

                    if (!store) return res.status(400).send({ error: `This store does not belong to this user` })

                    const resume = await Order.findOne({
                        where: { id: order_id, store_id },
                        include: [
                            {
                                association: `client`,
                                attributes: {
                                    exclude: [
                                        `password_hash`,
                                        `passwordResetToken`,
                                        `passwordResetExpires`,
                                        `wireId`,
                                        `ownId`,
                                    ],
                                },
                                include: { association: `delivery_addresses` },
                            },
                            includes,
                        ],
                    })

                    if (!resume) return res.status(400).send({ error: `Order does not exist` })

                    return res.json(resume)
                }
                //super
                const resume = await Order.findByPk(order_id, {
                    include: [
                        {
                            association: `client`,
                            attributes: {
                                exclude: [
                                    `password_hash`,
                                    `passwordResetToken`,
                                    `passwordResetExpires`,
                                    `wireId`,
                                    `ownId`,
                                ],
                            },
                            include: { association: `delivery_addresses` },
                        },
                        includes,
                    ],
                })

                return res.json(resume)
            }

            //todos
            //manager / adm
            if (user.type == `storeAdministrator`) {
                //only get in administrator store

                //get all stores from administrator
                const store = await Store.findOne({ where: { id: store_id, user_id } })

                if (!store) return res.status(400).send({ error: `This store does not belong to this user` })

                //filtro

                const resume = await Order.findAll({
                    limit: filter.limit || 20,
                    order: [filter.order] || ['id', 'ASC'],
                    where: whereFilter,
                    include: [
                        {
                            association: `client`,
                            attributes: {
                                exclude: [
                                    `password_hash`,
                                    `passwordResetToken`,
                                    `passwordResetExpires`,
                                    `wireId`,
                                    `ownId`,
                                ],
                            },
                            include: { association: `delivery_addresses` },
                        },
                        includes,
                    ],
                })

                return res.json(resume)
            }
            //super
            const resume = await Order.findAll({
                limit: filter.limit || 20,
                order: [filter.order] || ['id', 'ASC'],
                where: filter.date || { store_id },
                include: [
                    {
                        association: `client`,
                        attributes: {
                            exclude: [`password_hash`, `passwordResetToken`, `passwordResetExpires`, `wireId`, `ownId`],
                        },
                        include: { association: `delivery_addresses` },
                    },
                    includes,
                ],
            })

            return res.json(resume)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro listar pedidos`, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },

    async cancel(req, res) {
        const { order_id } = req.params
        //Get user id by token
        const authHeader = req.headers.authorization

        const { client_id, user_id } = await UserByToken(authHeader)

        if (client_id) {
            const order = await Order.update({ status: `canceled` }, { where: { id: order_id, client_id } })

            if (!order[0]) return res.status(400).send({ error: `This request does not belong to this user` })

            return res.status(200).send()
        } else {
            const user = await User.findByPk(user_id)

            if (user.type && user.type == `super`) {
                //Super admin
                //Update Order
                await Order.update({ status: `canceled` }, { where: { id: order_id } })

                return res.status(200).send()
            } else if (user.type && user.type != `super`) {
                //admin
                const order = await Order.update(
                    { status: `canceled` },
                    {
                        where: { id: order_id },
                        include: {
                            association: `client`,
                            include: {
                                association: `store`,
                                where: { user_id },
                            },
                        },
                    }
                )

                if (!order[0])
                    return res.status(400).send({ error: `This order does not belong to any store of this user` })

                return res.status(200).send()
            }
        }

        console.log(`Aqui entrou`)
    },

    async update(req, res) {
        try {
            const { order_id } = req.params
            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id } = await UserByToken(authHeader)

            const order = await Order.findOne({ where: { id: order_id, client_id } })

            if (!order) return res.status(400).send({ error: `This order not exist` })

            //Delete all products
            await ProdutctOrder.destroy({ where: { order_id } })

            const { products } = req.body

            const orderProducts = products.map(async (item) => {
                const product = await Product.findByPk(item.id)

                const mountjson = {
                    store_id: product.store_id,
                    order_id: order_id,
                    client_id,
                    product_id: item.id,
                    variation_id: item.variation || null,
                    quantity: item.quantity,
                }

                return mountjson
            })

            const bulk = await Promise.all(orderProducts)

            //recriar products
            await ProdutctOrder.bulkCreate(bulk)

            const resume = await Order.findByPk(order_id, {
                include: [
                    {
                        association: `client`,
                        attributes: { exclude: [`password_hash`] },
                        include: { association: `delivery_addresses`, where: { active: true } },
                    },
                    {
                        association: `coupon`,
                    },
                    {
                        association: 'products_order',
                        attributes: [`quantity`],
                        include: [
                            {
                                association: `product`,
                                attributes: { exclude: [`store_id`, `stock`, `cust_price`] },
                            },
                            {
                                association: `variation`,
                                attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                include: [{ association: `image` }, { association: `variation_info` }],
                            },
                        ],
                    },
                ],
            })

            return res.json(resume)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro ao atualizar pedido: `, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async delete(req, res) {
        const { order_id } = req.params
        //Get user id by token
        const authHeader = req.headers.authorization

        const { client_id, user_id } = await UserByToken(authHeader)

        if (client_id) {
            const order = await Order.destroy({ where: { id: order_id, client_id } })

            if (!order) return res.status(400).send({ error: `This request does not belong to this user` })

            return res.status(200).send()
        } else {
            const user = await User.findByPk(user_id)

            if (user.type && user.type == `super`) {
                //Super admin
                //Delete Order
                await Order.destroy({ where: { id: order_id } })

                return res.status(200).send()
            } else if (user.type && user.type != `super`) {
                //admin
                const order = await Order.destroy({
                    where: { id: order_id },
                    include: {
                        association: `client`,
                        include: {
                            association: `store`,
                            where: { user_id },
                        },
                    },
                })

                if (!order)
                    return res.status(400).send({ error: `This order does not belong to any store of this user` })

                return res.status(200).send()
            }
        }

        console.log(`Aqui entrou`)
    },
}
