const Order = require('../models/Order')
const Coupon = require('../models/Coupon')
const UserByToken = require('../middlewares/userByToken')
const User = require('../models/User')
const Client = require('../models/Client')
const ProductOrder = require('../models/ProductOrder')

module.exports = {
    async index(req, res) {

    },

    async Store(req, res) {
        try {
            //Get on params store id
            const { store_id, client_id } = req.params
            //get on body values
            const { code, value, valid_from, valid_to } = req.body

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            console.log(`UserToken: `, user_id);

            //check user and store
            const user = await User.findByPk(user_id, {
                include: {
                    association: `stores`,
                    where: { id: store_id }
                }
            })

            if (!user)
                return res.status(400).send({ error: `This store does not belong to this user` })

            const coupon = await Coupon.create({
                store_id,
                client_id,
                code,
                value,
                valid_from,
                valid_to,
                active: true
            })

            return res.json(coupon)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro ao criar cupom: `, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async insert(req, res) {
        try {
            //get code and order
            const { coupon_code, order_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id } = await UserByToken(authHeader)

            //get coupon
            const coupon = await Coupon.findOne({ where: { code: coupon_code } })

            if (!coupon)
                return res.status(400).send({ error: `This coupon not exist` })

            const client = await Client.findByPk(client_id, {
                include: {
                    association: `order`,
                    where: { id: order_id },
                    include: {
                        association: `products_order`,
                        include: [
                            {
                                association: `product`,
                                where: { store_id: coupon.store_id }
                            },
                            {
                                association: `variation`,
                                where: { store_id: coupon.store_id }
                            }
                        ]
                    }
                }
            })

            if (!client)
                return res.status(400).send({ error: `This order not exist` })

            if (!client.order[0].products_order.length)
                return res.status(400).send({ error: `Don't have products valid on this coupon` })

            const products = client.order[0].products_order.map(item => {
                return item.price
            }).reduce((a, b) => a + b)

            const order = await Order.update({
                discount: products - coupon.value,
                total: client.order[0].total - coupon.value
            }, { where: { id: order_id } })

            return res.json(client)

        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro ao inserir cupon ao pedido: `, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: `Erro de servidor` })
        }
    }
};
