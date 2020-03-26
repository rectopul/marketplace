const Client = require('../models/Client');
const Store = require('../models/Stores')
const User = require('../models/User')

const jwt = require('jsonwebtoken')
const { promisify } = require("util");

module.exports = {
    async index(req, res) {
        const { client_id } = req.params
        const client = await Client.findByPk(client_id);

        return res.json(client);
    },

    async store(req, res) {
        const { store_id } = req.params
        const { name, email, phone, cell, password, cpf, address, zipcode, city, state } = req.body

        const store = await Store.findByPk(store_id)

        if (!store) {
            return res.status(400).json({ error: "Store not exist" });
        }

        const ClientMail = await Client.findOne({ where: { email } })

        const ClientCpf = await Client.findOne({ where: { cpf } })

        const ClientPhone = await Client.findOne({ where: { phone } })

        const ClientCell = await Client.findOne({ where: { cell } })

        if (ClientMail) {
            return res.status(401).json({ message: 'the email you entered is already registered' })
        } else if (ClientCpf) {
            return res.status(401).json({ message: 'the cpf you entered is already registered' })
        } else if (ClientPhone) {
            return res.status(401).json({ message: 'the phone you entered is already registered' })
        } else if (ClientCell) {
            return res.status(401).json({ message: 'the cell you entered is already registered' })
        }

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
            store_id
        })
            .then(result => {
                return res.json(result);
            })
            .catch(err => {
                return res.status(400).send({ error: err })
            })


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
