const Client = require('../models/Client');
const Store = require('../models/Stores')
const User = require('../models/User')
const UserbyToken = require('../middlewares/userByToken')

const jwt = require('jsonwebtoken')
const { promisify } = require("util");

module.exports = {
    async index(req, res) {
        const authHeader = req.headers.authorization

        const { client_id } = await UserbyToken(authHeader)

        if (!client_id)
            return res.status(400).send({ error: `This user not exist` })

        const client = await Client.findByPk(client_id, {
            attributes: { exclude: [`password_hash`, `createdAt`, `updatedAt`] }
        });

        return res.json(client);
    },

    async store(req, res) {
        try {
            const { name, email, phone, cell, password, cpf, address, zipcode, city, state } = req.body

            const client = await Client.create({
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
                active: true,
            })

            const getClient = await Client.findByPk(client.id, {
                attributes: { exclude: [`password_hash`, `created_at`, `updated_at`] }
            })

            return res.json(getClient)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro ao criar novo cliente: `, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async clientActive(req, res) {
        try {
            const { client_id } = req.params

            //Pegar id do usuário a partir do token
            const authHeader = req.headers.authorization
            const [, token] = authHeader.split(" ");

            decoded = jwt.verify(token, process.env.APP_SECRET)

            const user_id = decoded.id

            //Buscar usuario by token
            const user = await User.findByPk(user_id)

            if (!user)
                return res.status(400).send({ error: `User does not exist` })

            if (!user.type == `storeAdministrator` || !user.type == `storeManager` || !user.type == `super`)
                return res.status(400).send({ error: `User is not allowed to perform this task` })

            //Verifica a loja do cliente
            const client = await Client.findByPk(client_id)

            if (!client)
                return res.status(400).send({ error: `Customer does not exist` })

            const store = Store.findByPk(client.store_id)

            if (!store || user.type != `super`)
                return res.status(400).send({ error: `This user has no autonomy over this client` })

            //Ativa o cliente
            const active = await Client.update({ active: true }, { where: { id: client_id } })

            return res.status(200).send({ message: `Client activated` })

        } catch (error) {
            return res.status(400).send({ error })
        }
    },

    async clientDisable(req, res) {
        try {
            const { client_id } = req.params

            //Pegar id do usuário a partir do token
            const authHeader = req.headers.authorization
            const [, token] = authHeader.split(" ");

            decoded = jwt.verify(token, process.env.APP_SECRET)

            const user_id = decoded.id

            //Buscar usuario by token
            const user = await User.findByPk(user_id)

            if (!user)
                return res.status(400).send({ error: `User does not exist` })

            if (!user.type == `storeAdministrator` || !user.type == `storeManager` || !user.type == `super`)
                return res.status(400).send({ error: `User is not allowed to perform this task` })

            //Verifica a loja do cliente
            const client = await Client.findByPk(client_id)

            if (!client)
                return res.status(400).send({ error: `Customer does not exist` })

            const store = Store.findByPk(client.store_id)

            if (!store || user.type != `super`)
                return res.status(400).send({ error: `This user has no autonomy over this client` })

            //Ativa o cliente
            const active = await Client.update({ active: false }, { where: { id: client_id } })

            return res.status(200).send({ message: `Client disable` })

        } catch (error) {
            return res.status(400).send({ error })
        }
    }
};
