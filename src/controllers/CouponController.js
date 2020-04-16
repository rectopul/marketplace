const Order = require('../models/Order')
const Coupon = require('../models/Coupon')
const UserByToken = require('../middlewares/userByToken')
const User = require('../models/User')

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

        } catch (error) {

        }
    }
};
