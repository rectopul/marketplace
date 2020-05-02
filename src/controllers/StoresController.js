const User = require('../models/User')
const Store = require('../models/Stores')
const jwt = require('jsonwebtoken')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        const authHeader = req.headers.authorization

        if (!authHeader) return res.status(401).send({ error: 'No token provided 3' })

        const [, token] = authHeader.split(' ')

        var decoded

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            return res.status(401).send({ error: 'unauthorized' })
        }

        const user_id = decoded.id

        const user = await User.findByPk(user_id, {
            include: { association: 'stores' },
        })

        return res.json(user)
    },

    async store(req, res) {
        const { name, email, phone, cell, url, zipcode, state, city, street, number } = req.body

        const authHeader = req.headers.authorization

        if (!authHeader) return res.status(401).send({ error: 'No token provided 4' })

        const [, token] = authHeader.split(' ')

        var decoded

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            return res.status(401).send({ error: 'unauthorized' })
        }

        const user_id = decoded.id

        const user = await User.findByPk(user_id)

        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        //Check email name
        const consultname = await Store.findOne({ where: { name } })

        if (consultname) return res.status(400).json({ error: 'Store name already exist!' })
        //Check email exists
        const consultmail = await Store.findOne({ where: { email } })

        if (consultmail) return res.status(400).json({ error: 'Store e-mail already exist!' })

        //Check Phone
        const consulphone = await Store.findOne({ where: { phone } })

        if (consulphone) return res.status(400).json({ error: 'Store phone already exist!' })
        //Check cell
        const consultcell = await Store.findOne({ where: { cell } })

        if (consultcell) return res.status(400).json({ error: 'Store cell already exist!' })
        //Check url
        const consulurl = await Store.findOne({ where: { url } })

        if (consulurl) return res.status(400).json({ error: 'Store url already exist!' })

        await Store.create({
            name,
            email,
            phone,
            cell,
            url,
            zipcode,
            state,
            city,
            street,
            number,
            user_id,
        })
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                return res.status(400).send({ error: err })
            })
    },

    async storeUpdate(req, res) {
        try {
            const { store_id } = req.params

            //delete fields not updated
            if (req.body.user_id) return res.status(400).send({ error: `Cannot change store owner` })

            //Pegar id do usuário a partir do token
            const authHeader = req.headers.authorization
            const [, token] = authHeader.split(' ')

            let decoded = jwt.verify(token, process.env.APP_SECRET)

            const user_id = decoded.id

            const store = await Store.findOne({ where: { id: store_id, user_id } })

            if (!store) return res.status(400).send({ error: `This store does not belong to this user` })

            let updateValues = {}
            await Object.keys(req.body).map((item) => {
                if (req.body[item] != undefined && item != `id`) return (updateValues[item] = req.body[item])
            })

            const storeupdate = await Store.update(updateValues, { where: { id: store_id }, returning: true, plain: true })

            return res.status(200).send(storeupdate[1])
        } catch (error) {
            console.log(`Erro ao Atualizar Produto`, error)
            return res.status(400).send({ error })
        }
    },

    async delete(req, res) {
        try {
            const { store_id } = req.params
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const user = await User.findByPk(user_id)

            //check store exist
            const ext = await Store.findByPk(store_id)

            if (!ext) return res.status(400).send({ error: `This store do not exist` })

            //super
            if (user.type == `super`) {
                await Store.destroy({ where: { id: store_id } })

                return res.status(200).send()
            }

            //check
            const store = await Store.findOne({ where: { user_id, id: store_id } })

            if (!store) return res.status(400).send({ error: `This store does not belong to this user` })

            await Store.destroy({ where: { id: store_id } })
            return res.status(200).send()
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro ao excluir loja: `, error)

            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },
}
