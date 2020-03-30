const Manager = require('../models/Manager')
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { promisify } = require("util");
const crypto = require('crypto')
const mailer = require('../modules/mailer')
const UserByToken = require('../middlewares/userByToken')
const Store = require('../models/Stores')

module.exports = {
    async index(req, res) {
        try {
            const { manager: manager_id, store: store_id } = req.query

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const user = await User.findByPk(user_id)

            //Com user_id
            if (manager_id) {

                //super
                if (user && user.type == `super`) {
                    const managers = await Manager.findByPk(manager_id, { attributes: { exclude: [`password_hash`] } })

                    return res.json(managers)
                }

                //Adm
                const manager = await Manager.findByPk(manager_id, { attributes: { exclude: [`password_hash`] } })

                const store = await Store.findOne({ where: { id: manager.id, user_id } })

                //Checar se a loja existe
                if (!store)
                    return res.status(400).send({ error: `This user does not belong to your store` })

                return res.json(manager)
            }

            //super
            if (user && user.type == `super`) {
                if (!store_id) {
                    const managers = await Manager.findAll({ attributes: { exclude: [`password_hash`] } })

                    return res.json(managers)
                } else {
                    const managers = await Manager.findAll({
                        where: { store_id },
                        attributes: { exclude: [`password_hash`] }
                    })
                    return res.json(managers)
                }

            }

            //Adm
            const manager = await Manager.findAll({
                where: { store_id },
                attributes: { exclude: [`password_hash`] }
            })

            const store = await Store.findByPk(store_id)

            //Checar se a loja existe
            if (!store)
                return res.status(400).send({ error: `This user does not belong to your store` })

            return res.json(manager)

        } catch (error) {

        }
    },

    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const {
                name,
                email,
                password,
                phone,
                cell,
                cpf,
                address,
                zipcode,
                city,
                state
            } = req.body

            const { store_id } = req.params

            const store = await Store.findOne({ where: { id: user_id, user_id } })

            //Super user
            const user = await User.findByPk(user_id)

            if (user.type == `super`) {
                const manager = await Manager.create({
                    name,
                    email,
                    password,
                    phone,
                    cell,
                    cpf,
                    address,
                    zipcode,
                    city,
                    state,
                    type: `storeManager`,
                    store_id
                })

                const managerJson = manager.toJSON()

                delete managerJson.password_hash

                return res.json(managerJson)
            }

            //check se a loja pertence ao usuário
            if (!store)
                return res.status(400).send({ error: `This store does not belong to this user` })

            if (user.type != `storeAdministrator`)
                return res.status(400).send({ error: `User is not allowed to create store managers` })

            //Admin create
            const manager = await Manager.create({
                name,
                email,
                password,
                phone,
                cell,
                cpf,
                address,
                zipcode,
                city,
                state,
                type: `storeManager`,
                store_id
            })

            const managerJson = manager.toJSON()

            delete managerJson.password_hash

            return res.json(managerJson)


        } catch (error) {
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro ao listar carrinhos`, error.message);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: error })
        }
    }
}