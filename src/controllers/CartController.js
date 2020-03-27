const Store = require("../models/Stores");
const Client = require('../models/Client')
const jwt = require("jsonwebtoken");
const ClientMiddleware = require('../middlewares/ClientMiddleware')
const Cart = require('../models/Cart')
const UserByToken = require('../middlewares/userByToken')
const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try {

            const { cart_id: id } = req.params

            const cart = await Cart.findByPk(id, { include: { association: `cartProducts` } })

            return res.json(cart)

        } catch (error) {
            return res.status(400).send({ error })
        }
    },

    async listAll(req, res) {

        try {

            //Get user id by token
            const authHeader = req.headers.authorization;

            const user_id = await UserByToken(authHeader)

            const user = await User.findByPk(user_id)

            if (user.type != `super`)
                return res.status(400).send({ error: `You are not allowed to perform this action` })

            const carts = await Cart.findAll({ include: { association: `cartProducts` } })

            return res.json(carts)

        } catch (error) {
            console.log(`Erro ao listar todos os carrinhos`, error);
            //return res.status(400).send({ error })
        }

    },

    async list(req, res) {

        try {

            const { store_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization;

            const user_id = await UserByToken(authHeader)
            const user = await User.findByPk(user_id)

            //Busca administradores da loja
            const shopManagers = await User.findOne({ where: { id: user_id, store_id } })

            //Verify if store é do usuario
            const store = await Store.findOne({ where: { id: store_id } })

            if (!store)
                return res.status(400).send({ error: `This shop not exists` })

            if (user.type != `super`) {

                if ((store.user_id != user_id) || shopManagers.type != `storeAdministrator` || shopManagers.type != `storeManager`)
                    return res.status(400).send({ error: `You do not have access to list these carts` })
            }

            const carts = await Cart.findAll({ include: { association: `cartProducts` }, where: { store_id } })

            return res.json(carts)

        } catch (error) {
            console.log(`Erro ao listar carrinhos`, error);
            return res.status(400).send({ error })
        }
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
