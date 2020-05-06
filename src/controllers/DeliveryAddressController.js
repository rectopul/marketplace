const Store = require('../models/Stores')
const Client = require('../models/Client')
const User = require('../models/User')
const Delivery = require('../models/DeliveryAddress')
const UserByToken = require('../middlewares/userByToken')
const { Op } = require('sequelize')

module.exports = {
    async index(req, res) {
        try {
            const { delivery_id } = req.params
            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id, user_id } = await UserByToken(authHeader)

            //clientes
            if (client_id) {
                //unitario
                if (delivery_id) {
                    const address = await Delivery.findOne({ where: { id: delivery_id, client_id } })

                    if (!address) return res.status(400).send({ error: `This address does not belong to this user` })

                    return res.json(address)
                } else {
                    //todos
                    const address = await Client.findByPk(client_id, { include: { association: `delivery_addresses` } })

                    return res.json(address)
                }
            }

            //Administradores
            if (user_id) {
                //get user
                const user = await User.findByPk(user_id)

                //super
                if (user.type == `super`) {
                    //unitario
                    if (delivery_id) {
                        const address = await Delivery.findOne({ where: { id: delivery_id } })

                        return res.json(address)
                    } else {
                        //todos
                        const address = await Client.findAll({
                            association: { association: `delivery_addresses` },
                        })

                        return res.json(address)
                    }
                } else {
                    //unitario
                    if (delivery_id) {
                        const address = await Delivery.findOne({ where: { id: delivery_id } })

                        //get client

                        return res.json(address)
                    } else {
                        const stores = await Store.findAll({ where: { user_id } })
                        //create operator
                        const operators = stores.map((id) => {
                            return id.id
                        })

                        //todos
                        const address = await Client.findAll({
                            where: {
                                store_id: {
                                    [Op.or]: operators,
                                },
                            },
                            include: { association: `delivery_addresses` },
                        })

                        return res.json(address)
                    }
                }
            }
        } catch (error) {
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro listar endereço de entrega: `, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },

    async store(req, res) {
        try {
            const {
                name,
                cpf,
                phone,
                zipcode,
                city,
                street,
                number,
                address,
                receiver_name,
                address_type,
                additional_information,
                delivery_instructions,
                delivery_number,
                state,
            } = req.body

            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id } = await UserByToken(authHeader)

            if (!client_id) return res.status(400).send({ error: `This customer does not exist` })

            // check if is first record
            let active = true

            const checkFirst = await Delivery.findOne({ where: { client_id } })

            if (checkFirst) active = false

            const delivery = await Delivery.create({
                name,
                cpf,
                phone,
                zipcode,
                city,
                street,
                number,
                address,
                state,
                receiver_name,
                address_type,
                additional_information,
                delivery_instructions,
                delivery_number,
                active,
                client_id,
            })

            //find client
            const clientReturn = await Client.findByPk(client_id, {
                attributes: { exclude: [`password_hash`, `passwordResetToken`, `passwordResetExpires`] },
                include: {
                    association: `delivery_addresses`,
                    where: { id: delivery.id },
                },
            })

            return res.json(clientReturn)
        } catch (error) {
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro inserir endereço de entrega: `, error.message)
            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `SequelizeDatabaseError`
            )
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },

    async delete(req, res) {
        try {
            const { delivery_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id, user_id } = await UserByToken(authHeader)

            //client
            if (client_id) {
                const addressDel = await Delivery.destroy({ where: { id: delivery_id } })

                if (!addressDel) return res.status(400).send({ error: `This address does not exist` })

                return res.status(200).send()
            }

            //super
            const user = await User.findByPk(user_id)

            if (user.type == `super`) {
                const addressDel = await Delivery.destroy({ where: { id: delivery_id } })

                if (!addressDel) return res.status(400).send({ error: `This address does not exist` })

                return res.status(200).send()
            } else {
                //ger address
                const address = await Delivery.findByPk(delivery_id)

                if (!address) return res.status(400).send({ error: `This address does not exist` })

                const client = await Client.findByPk(address.client_id, {
                    include: [
                        {
                            association: `store`,
                            where: { user_id },
                        },
                    ],
                })

                if (!client) return res.status(400).send({ error: `This store does not belong to this user` })

                await Delivery.destroy({ where: { id: delivery_id } })

                return res.status(200).send()
            }
        } catch (error) {
            if (error.name == `JsonWebTokenError` || error.name == `TokenExpiredError`) return res.status(400).send({ error })

            console.log(`Erro excluir endereço de entrega: `, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },

    async update(req, res) {
        try {
            const { name, cpf, zipcode, city, address, state, active } = req.body

            const { delivery_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id } = await UserByToken(authHeader)

            //client
            if (client_id) {
                const addressCheck = await Delivery.findOne({ where: { id: delivery_id, client_id } })

                if (!addressCheck) return res.status(400).send({ error: `This address does not exist` })

                if (active) {
                    await Delivery.update(
                        { active: false },
                        {
                            where: { client_id, active: true },
                        }
                    )

                    const activeAddress = await Delivery.update(
                        { active: true },
                        {
                            where: { client_id, id: delivery_id },
                            returning: true,
                            plain: true,
                        }
                    )

                    return res.json(activeAddress)
                }

                const addressUpdate = await Delivery.update(
                    {
                        name,
                        cpf,
                        zipcode,
                        city,
                        address,
                        state,
                    },
                    { where: { id: delivery_id }, returning: true, plain: true }
                )

                return res.json(addressUpdate[1])
            }
        } catch (error) {
            if (error.name == `JsonWebTokenError` || error.name == `TokenExpiredError`) return res.status(400).send({ error })

            console.log(`Erro excluir endereço de entrega: `, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },
}
