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

        //Get user id by token
        const authHeader = req.headers.authorization;

        let user_id = null

        if (authHeader) {
            const client_id = await ClientMiddleware(authHeader).catch(async err => {
                if (err == `User informed by token not exists` || err == `unauthorized`) {
                    user_id = await UserByToken(authHeader).catch(error => {
                        return res.status(400).send({ error })
                    })

                    err = undefined
                } else {
                    return res.status(400).send({ error: err })
                }
            })
        }


        try {

            const { session_id } = req.params

            if (!session_id) {

                //Caso seja um usuário
                if (user_id) {
                    const user = await User.findByPk(user_id).catch(err => {
                        return console.log(`Erro ao selecionar usuário: `, err);
                    })

                    //Busca administradores da loja
                    const shopManagers = await User.findOne({ where: { id: user_id } })

                    //Verify if store é do usuario
                    const store = await Store.findOne({ where: { user_id } })

                    if (!store)
                        return res.status(400).send({ error: `This shop not exists` })

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

                const cartsClient = await Cart.findAll({ include: { association: `cartProducts` }, where: { client_id } })

                return res.json(cartsClient)

            }

            console.log(`Entro com session`, session_id)

            //Busca única por usuarios
            if (user_id) {
                const user = await User.findByPk(user_id).catch(err => {
                    return console.log(`Erro ao selecionar usuário: `, err);
                })

                //Busca administradores da loja
                const shopManagers = await User.findOne({ where: { id: user_id } })

                //Verify if store é do usuario
                const store = await Store.findOne({ where: { user_id } })

                if (!store)
                    return res.status(400).send({ error: `This shop not exists` })

                if (user && user.type != `super`) {

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
                        where: { session_id }
                    })


                    return res.json(carts)

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
            console.log(`Erro ao listar carrinhos`, error);
            return res.status(500).send({ error })
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
                values.client_id = await ClientMiddleware(authHeader, store_id)
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

    }
};
