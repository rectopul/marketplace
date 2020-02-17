const Client = require('../models/Client');
const Store = require('../models/Stores')

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
            store_id
        })
            .then(result => {
                return res.json(result);
            })
            .catch(err => {
                console.log(err);
            })


    },
};
