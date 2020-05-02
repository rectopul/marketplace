const Product = require('../models/Product')
const Sigep = require('../modules/Sigep')
const userByToken = require('../middlewares/userByToken')
const Client = require('../models/Client')
const Order = require('../models/Order')
const OderDelivery = require('../models/OrderDelivery')

module.exports = {
    async index(req, res) {
        try {
            const { product_id } = req.params
            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id } = await userByToken(authHeader)

            const product = await Product.findByPk(product_id, {
                include: { association: `stores` },
            })

            if (!product) return res.status(400).send({ error: `This product not exist` })

            const client = await Client.findByPk(client_id, {
                include: {
                    association: `delivery_addresses`,
                    where: { active: true },
                },
            })

            //console.log(`Produto: `, client)

            if (!client || !client.delivery_addresses) return res.status(400).send({ error: `Customer has no shipping address` })

            const sigep = await Sigep('calc')

            const params = {
                sCepOrigem: product.stores.zipcode,
                sCepDestino: client.delivery_addresses[0].zipcode,
                nVlPeso: parseFloat(product.weight),
                nVlComprimento: parseFloat(product.length),
                nVlAltura: parseFloat(product.height),
                nVlLargura: parseFloat(product.width),
                nVlDiametro: 0,
            }

            const frete = await sigep.CalcPrecoPrazo(params)

            return res.json({
                product,
                client,
                frete,
            })
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            if (error.name == `SigepError`) return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo cliente: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res) {
        try {
            const { order_id } = req.params
            const { service } = req.body
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            if (!user_id) return res.status(400).send({ error: `This user not exist` })

            const order = await Order.findByPk(order_id, {
                include: [
                    {
                        association: `client`,
                        attributes: { exclude: [`password_hash`, `passwordResetToken`, `passwordResetExpires`] },
                        include: {
                            association: `delivery_addresses`,
                            where: { active: true },
                        },
                    },
                    { association: `store`, where: { user_id } },
                    { association: `products_order`, include: { association: `product` } },
                ],
            })

            if (!order) return res.status(400).send({ error: `This order not exist` })

            //check store from user
            if (!order.store) return res.status(400).send({ error: `This request does not belong to this user` })

            const product = order.products_order[0].product

            if (!product) return res.status(400).send({ error: `This product not exist` })

            const client = order.client

            if (!client || !client.delivery_addresses) return res.status(400).send({ error: `Customer has no shipping address` })

            const sigep = await Sigep('calc')

            if (!sigep) return res.status(400).send({ error: `Unable to calculate delivery` })

            const params = {
                sCepOrigem: order.store.zipcode,
                sCepDestino: client.delivery_addresses[0].zipcode,
                nVlPeso: parseFloat(product.weight),
                nVlComprimento: parseFloat(product.length),
                nVlAltura: parseFloat(product.height),
                nVlLargura: parseFloat(product.width),
                nVlDiametro: 0,
            }

            const frete = await sigep.CalcPrecoPrazo(params)

            let now = new Date()

            now = new Date(now.setDate(now.getDate() + parseInt(frete[service].PrazoEntrega)))

            console.log(`Frete: `, parseInt(frete[service].PrazoEntrega))
            console.log(`Produto: `, now)

            //insert delivery
            const delivery = await OderDelivery.create({
                order_id,
                client_id: client.id,
                store_id: order.store.id,
                delivery_id: client.delivery_addresses[0].id,
                service,
                service_code: frete[service].Codigo,
                delivery_time: frete[service].PrazoEntrega,
                delivery_date: now,
                value: parseFloat(frete[service].Valor),
                status: `Aguardando postagem`,
            })

            return res.json({
                product,
                client,
                delivery,
            })
        } catch (error) {
            //Validação de erros
            console.log(`Erro ao inserir endereco de entrega: `, error)

            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`) {
                if (error.errors) return res.status(400).send({ error: error.errors[0].message })
                return res.status(400).send({ error: error.message })
            }

            if (error.name == `SigepError`) return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
