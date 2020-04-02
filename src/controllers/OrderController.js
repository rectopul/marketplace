const Client = require('../models/Client');
const Store = require('../models/Stores')
const Order = require('../models/Order')
const ProdutctOrder = require('../models/ProductOrder')
const UserByToken = require('../middlewares/userByToken')
const User = require('../models/User')

const jwt = require('jsonwebtoken')
const { promisify } = require("util");
const { Op } = require('sequelize')

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
                                include: { association: `delivery_addresses` }
                            },
                            {
                                association: 'products_order',
                                attributes: [`quantity`],
                                include: [
                                    {
                                        association: `product`,
                                        attributes: { exclude: [`store_id`, `stock`, `cust_price`] }
                                    },
                                    {
                                        association: `variation`,
                                        attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                        include: [
                                            { association: `image` },
                                            { association: `variation_info` },
                                        ]
                                    }
                                ]
                            }
                        ]
                    })

                    return res.json(resume)
                }
            }

            //todos
            const resume = await Order.findAll({
                where: { client_id: client_id || user_id },
                attributes: { exclude: [`client_id`] },
                include: [
                    {
                        association: `client`,
                        include: { association: `delivery_addresses` }
                    },
                    {
                        association: 'products_order',
                        attributes: [`quantity`],
                        include: [
                            {
                                association: `product`,
                                attributes: { exclude: [`store_id`, `stock`, `cust_price`] }
                            },
                            {
                                association: `variation`,
                                attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                include: [
                                    { association: `image` },
                                    { association: `variation_info` },
                                ]
                            }
                        ]
                    }
                ]
            })

            return res.json(resume)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro listar endereço de entrega: `, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: error })
        }
    },

    async store(req, res) {

        try {
            const { store_id } = req.params

            const { products, cart_id } = req.body

            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id, user_id } = await UserByToken(authHeader)

            if (products) {
                //clients
                if (client_id) {
                    //cliente
                    const client = await Client.findByPk(client_id)
                    //loja
                    const store = await Store.findByPk(client.store_id)

                    const order = await Order.create({
                        store_id: store.id,
                        client_id,
                        status: `pagamento_pendente`
                    })

                    //map products
                    const productsId = products.map(item => {
                        const mountjson = {
                            store_id: store.id,
                            order_id: order.id,
                            client_id,
                            product_id: item.id,
                            variation_id: item.variation || null,
                            quantity: item.quantity
                        }

                        return mountjson
                    })

                    //insert products
                    const prodct = await ProdutctOrder.bulkCreate(productsId)

                    const resume = await Order.findByPk(order.id, {
                        attributes: { exclude: [`client_id`] },
                        include: [
                            {
                                association: `client`,
                                include: { association: `delivery_addresses` }
                            },
                            {
                                association: 'products_order',
                                attributes: [`quantity`],
                                include: [
                                    {
                                        association: `product`,
                                        attributes: { exclude: [`store_id`, `stock`, `cust_price`] }
                                    },
                                    {
                                        association: `variation`,
                                        attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                        include: [
                                            { association: `image` },
                                            { association: `variation_info` },
                                        ]
                                    }
                                ]
                            }
                        ]
                    })

                    return res.json(resume)

                }
                //users

            }

        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro listar endereço de entrega: `, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: error })
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
            const { limit, order, date } = req.query
            //mount query filter
            let filter = {}

            //com limitador
            if (limit) filter.limit = limit

            //order
            if (order) filter.order = [`id`, order]
            //date
            if (date) {
                const to = `${date[0]} 00:00:00.000+00`
                const from = `${date[1]} 23:59:28.516+00`
                filter.date = { store_id, createdAt: { [Op.between]: [to, from] } }

            }

            if (order_id) {
                //unitário
                //manager / adm
                if (user.type == `storeAdministrator`) {
                    //only get in administrator store

                    //get all stores from administrator
                    const store = await Store.findByPk(store_id)

                    if (!store)
                        return res.status(400).send({ error: `This store does not belong to this user` })

                    const resume = await Order.findOne({
                        where: { id: order_id, store_id },
                        include: [
                            {
                                association: `client`,
                                include: { association: `delivery_addresses` }
                            },
                            {
                                association: 'products_order',
                                attributes: [`quantity`],
                                include: [
                                    {
                                        association: `product`,
                                        attributes: { exclude: [`store_id`, `stock`, `cust_price`] }
                                    },
                                    {
                                        association: `variation`,
                                        attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                        include: [
                                            { association: `image` },
                                            { association: `variation_info` },
                                        ]
                                    }
                                ]
                            }
                        ]
                    })

                    if (!resume)
                        return res.status(400).send({ error: `Order does not exist` })

                    return res.json(resume)
                }
                //super
                const resume = await Order.findByPk(order_id, {
                    include: [
                        {
                            association: `client`,
                            include: { association: `delivery_addresses` }
                        },
                        {
                            association: 'products_order',
                            attributes: [`quantity`],
                            include: [
                                {
                                    association: `product`,
                                    attributes: { exclude: [`store_id`, `stock`, `cust_price`] }
                                },
                                {
                                    association: `variation`,
                                    attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                    include: [
                                        { association: `image` },
                                        { association: `variation_info` },
                                    ]
                                }
                            ]
                        }
                    ]
                })

                return res.json(resume)
            }

            //todos
            //manager / adm
            if (user.type == `storeAdministrator`) {
                //only get in administrator store

                //get all stores from administrator
                const store = await Store.findByPk(store_id)

                if (!store)
                    return res.status(400).send({ error: `This store does not belong to this user` })

                //filtro


                const resume = await Order.findAll({
                    limit: filter.limit || 20,
                    order: [filter.order] || ['id', 'ASC'],
                    where: filter.date || { store_id },
                    include: [
                        {
                            association: `client`,
                            include: { association: `delivery_addresses` }
                        },
                        {
                            association: 'products_order',
                            attributes: [`quantity`],
                            include: [
                                {
                                    association: `product`,
                                    attributes: { exclude: [`store_id`, `stock`, `cust_price`] }
                                },
                                {
                                    association: `variation`,
                                    attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                    include: [
                                        { association: `image` },
                                        { association: `variation_info` },
                                    ]
                                }
                            ]
                        }
                    ]
                })

                return res.json(resume)
            }
            //super
            const resume = await Order.findAll({
                include: [
                    {
                        association: `client`,
                        include: { association: `delivery_addresses` }
                    },
                    {
                        association: 'products_order',
                        attributes: [`quantity`],
                        include: [
                            {
                                association: `product`,
                                attributes: { exclude: [`store_id`, `stock`, `cust_price`] }
                            },
                            {
                                association: `variation`,
                                attributes: { exclude: [`store_id`, `user_id`, `upload_image_id`, `variation_id`] },
                                include: [
                                    { association: `image` },
                                    { association: `variation_info` },
                                ]
                            }
                        ]
                    }
                ]
            })

            return res.json(resume)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro listar pedidos`, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: error })
        }
    }
};
