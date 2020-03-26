const Store = require("../models/Stores");
const Client = require('../models/Client')
const jwt = require("jsonwebtoken");
const ClientMiddleware = require('../middlewares/ClientMiddleware')
const Cart = require('../models/Cart')

module.exports = {
    async index(req, res) {

    },

    async create(req, res) {
        try {

            //Caso nao passe token e nem a loja
            if (!req.headers.authorization && !req.params.store_id)
                return res.status(400).send({ error: `Log in or inform the cart store` })

            let values = {
                store_id: null,
                active: false
            }

            if (req.headers.authorization) {
                const authHeader = req.headers.authorization
                values.client_id = await ClientMiddleware(authHeader, store_id)
                const store = await Client.findByPk(client_id)
                values.store_id = store.store_id
            } else {
                values.store_id = req.params.store_id
            }

            const cart = await Cart.create(values)

            return res.json(cart)

        } catch (error) {
            console.log(`Erro ao criar carrinho: `, error);
            return res.status(400).send({ error })
        }
    }
};
