const Store = require("../models/Stores");
const Client = require('../models/Client')
const jwt = require("jsonwebtoken");
const ClientMiddleware = require('../middlewares/ClientMiddleware')
const Cart = require('../models/Cart')
const UserByToken = require('../middlewares/userByToken')
const User = require('../models/User')
const crypto = require('crypto')

module.exports = {
    async index(req, res) {
        try {

            const { cart_id: id } = req.params

            const cart = await Cart.UserByToken(id, { include: { association: `cartProducts` } })

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

        //Get user id by token
        const authHeader = req.headers.authorization

        try {

            const { session_id } = req.params

            if (authHeader) {

                const { client_id, user_id } = await UserByToken(authHeader)

                if (!session_id) {

                    //Caso seja um usuário
                    if (user_id) {
                        const user = await User.findByPk(user_id)

                        //Verify if store é do usuario
                        const store = await Store.findOne({ where: { user_id } })

                        if (!store)
                            return res.status(400).send({ error: `This shop not exists` })

                        //User type shopadministrator or shopmanager
                        if (user && user.type != `super`) {

                            const listcart = await Cart.findAll({
                                include: {
                                    association: `cartProducts`,
                                    attributes: [`quantity`],
                                    include: [
                                        {
                                            association: `product`,
                                            attributes: [
                                                `sku`,
                                                `title`,
                                                `description`,
                                                `brand`,
                                                `model`
                                            ],
                                            include: { association: `images_product` }
                                        },
                                        {
                                            association: `variation`,
                                            attributes: [
                                                `variable_sku`,
                                                `variable_regular_price`,
                                                `variable_sale_price`,
                                                `variable_description`
                                            ],
                                            include: [
                                                {
                                                    association: `variation_info`,
                                                    attributes: [
                                                        `attribute_name`,
                                                        `attribute_value`
                                                    ]
                                                },
                                                { association: `image` }
                                            ]
                                        }
                                    ]
                                },
                                where: { store_id: store.id }
                            })

                            return res.json(listcart)
                        }

                        //User type super
                        if (user && user.type == `super`) {

                            const carts = await Cart.findAll({
                                include: {
                                    association: `cartProducts`,
                                    attributes: [`quantity`],
                                    include: [
                                        {
                                            association: `product`,
                                            attributes: [
                                                `sku`,
                                                `title`,
                                                `description`,
                                                `brand`,
                                                `model`
                                            ],
                                            include: { association: `images_product` }
                                        },
                                        {
                                            association: `variation`,
                                            attributes: [
                                                `variable_sku`,
                                                `variable_regular_price`,
                                                `variable_sale_price`,
                                                `variable_description`
                                            ],
                                            include: [
                                                {
                                                    association: `variation_info`,
                                                    attributes: [
                                                        `attribute_name`,
                                                        `attribute_value`
                                                    ]
                                                },
                                                { association: `image` }
                                            ]
                                        }
                                    ]
                                }
                            })

                            return res.json(carts)
                        }
                    }

                    //Clients
                    const cartsClient = await Cart.findAll({ include: { association: `cartProducts` }, where: { client_id } })

                    return res.json(cartsClient)
                }

                const session = crypto.randomBytes(10).toString('hex')

                let cart, where

                if (/^\d+$/.test(session_id)) {
                    //Tipo cart id
                    cart = await Cart.findByPk(session_id)
                    where = { id: session_id }
                } else {
                    //Tipo session id
                    cart = await Cart.findOne({ where: { session_id } })
                    where = { session_id }
                }

                if (!cart)
                    return res.status(400).send({ error: `Cart not exists!` })


                //Busca única por usuarios
                if (user_id) {
                    const user = await User.findByPk(user_id)

                    //User type shopadministrator or shopmanager  
                    if (user && user.type != `super`) {

                        //Verify if store é do usuario
                        const store = await Store.findOne({ where: { id: cart.store_id, user_id } })

                        if (!store)
                            return res.status(400).send({ error: `This store does not belong to this user` })

                        const listcart = await Cart.findOne({
                            include: {
                                association: `cartProducts`,
                                attributes: [`quantity`],
                                include: [
                                    {
                                        association: `product`,
                                        attributes: [
                                            `sku`,
                                            `title`,
                                            `description`,
                                            `brand`,
                                            `model`
                                        ],
                                        include: { association: `images_product` }
                                    },
                                    {
                                        association: `variation`,
                                        attributes: [
                                            `variable_sku`,
                                            `variable_regular_price`,
                                            `variable_sale_price`,
                                            `variable_description`
                                        ],
                                        include: [
                                            {
                                                association: `variation_info`,
                                                attributes: [
                                                    `attribute_name`,
                                                    `attribute_value`
                                                ]
                                            },
                                            { association: `image` }
                                        ]
                                    }
                                ]
                            },
                            where: { session_id, store_id: store.id }
                        })

                        return res.json(listcart)
                    }

                    //User type super
                    if (user && user.type == `super`) {

                        const carts = await Cart.findOne({
                            include: {
                                association: `cartProducts`,
                                attributes: [`quantity`],
                                include: [
                                    {
                                        association: `product`,
                                        attributes: [
                                            `sku`,
                                            `title`,
                                            `description`,
                                            `brand`,
                                            `model`
                                        ],
                                        include: { association: `images_product` }
                                    },
                                    {
                                        association: `variation`,
                                        attributes: [
                                            `variable_sku`,
                                            `variable_regular_price`,
                                            `variable_sale_price`,
                                            `variable_description`
                                        ],
                                        include: [
                                            {
                                                association: `variation_info`,
                                                attributes: [
                                                    `attribute_name`,
                                                    `attribute_value`
                                                ]
                                            },
                                            { association: `image` }
                                        ]
                                    }
                                ]
                            },
                            where: where
                        })


                        return res.json(carts)

                    }
                }
            }


            const carts = await Cart.findOne({
                include: {
                    association: `cartProducts`,
                    attributes: [`quantity`],
                    include: [
                        {
                            association: `product`,
                            attributes: [
                                `sku`,
                                `title`,
                                `description`,
                                `brand`,
                                `model`
                            ],
                            include: { association: `images_product` }
                        },
                        {
                            association: `variation`,
                            attributes: [
                                `variable_sku`,
                                `variable_regular_price`,
                                `variable_sale_price`,
                                `variable_description`
                            ],
                            include: [
                                {
                                    association: `variation_info`,
                                    attributes: [
                                        `attribute_name`,
                                        `attribute_value`
                                    ]
                                },
                                { association: `image` }
                            ]
                        }
                    ]
                },
                where: { session_id, client_id: null }
            })

            return res.json(carts)


        } catch (error) {

            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro ao listar carrinhos`, error);
            return res.status(500).send({ error: `Erro interno` })
        }
    },

    async create(req, res) {
        try {

            const { session_id } = req.body

            if (!session_id)
                return res.status(400).send({ error: `Please sen session_id in body` })

            let values = {
                active: false,
                session_id
            }

            if (req.headers.authorization) {
                const authHeader = req.headers.authorization

                const { client_id } = await UserByToken(authHeader)

                if (!client_id)
                    return res.status(400).send({ error: `Customer does not exist` })

                values.client_id = client_id

                const store = await Client.findByPk(client_id)

                values.store_id = store.store_id
            }

            const cart = await Cart.create(values)

            return res.json(cart)

        } catch (error) {
            console.log(`Erro ao criar carrinho: `, error);
            return res.status(400).send({ error })
        }
    },

    async dellete(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { cart_id } = req.params

            const { user_id } = await UserByToken(authHeader)

            if (!user_id)
                return res.status(400).send({ error: `User is not allowed to delete this cart` })

            //super user
            const user = await User.findByPk(user_id)

            if (user.type == `super`) {
                const cartDestroy = await Cart.destroy({ where: { id: cart_id } })

                return res.status(200).send({ message: `Cart deleted` })
            } else {
                const cart = await Cart.findOne({ where: { id: cart_id } })

                //Store
                const store = await Store.findByPk(cart.store_id)

                if (!store)
                    return res.status(400).send({ error: `This store does not belong to this user` })

                //Somente storeAdministrator pode excluir um carrinho da propria loja
                if (user.type != `storeAdministrator`)
                    return res.status(400).send({ error: `User is not allowed to delete this cart` })

                const cartDestroy = await Cart.destroy({ where: { id: cart_id, store_id: store.id } })

                return res.status(200).send({ message: `Cart deleted` })
            }
        } catch (error) {
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro ao listar carrinhos`, error);
            return res.status(500).send({ error: `Erro interno` })
        }
    }
};
