/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
const Store = require('../models/Stores')
const User = require('../models/User')
const Product = require('../models/Product')
const Variation = require('../models/Variation')
const VariationMap = require('../models/VariationMap')
const VariableMapConstroller = require('./VariableMapController')
const UserByToken = require('../middlewares/userByToken')
const { Op } = require('sequelize')

module.exports = {
    async index(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const variations = await Variation.findAll({
                include: { association: `variation` },
            })

            return res.json(variations)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `wireOrderError` ||
                error.name == `bestSubmissionError` ||
                error.name == `StatusCodeError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar pedido: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async show(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const { variation_id } = req.params

            const variation = await Variation.findByPk(variation_id, {
                where: { variable_enabled: `true` },
                include: [{ association: `variation`, where: { variable_enabled: `true` } }, { association: `image` }],
            })

            return res.json(variation)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `wireOrderError` ||
                error.name == `bestSubmissionError` ||
                error.name == `StatusCodeError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao selecionar variação: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async mult(req, res) {
        const { store_id, product_id } = req.params

        const store = await Store.findByPk(store_id)

        if (!store) {
            return res.status(400).json({ error: 'Store informed not exists' })
        }

        const product = await Product.findByPk(product_id, {
            include: { association: 'product_variations' },
        })

        if (!product) {
            return res.status(400).json({ error: 'Product informed not exists' })
        }

        return res.json(product)
    },

    async update(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const { variation_id } = req.params

            const variation = await Variation.findByPk(variation_id)
            //get store by variation
            const store = await Store.findOne({ where: { id: variation.store_id, user_id } })

            if (!store) return res.status(400).send({ error: `This variation does not belong to your store` })

            const { attribute_name, attribute_value, variable_description, variable_enabled } = req.body

            await Variation.update(
                {
                    attribute_name,
                    attribute_value,
                    variable_description,
                    variable_enabled,
                },
                { where: { id: variation_id } }
            )

            const response = await Variation.findByPk(variation_id)

            return res.json(response)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `wireOrderError` ||
                error.name == `bestSubmissionError` ||
                error.name == `StatusCodeError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar pedido: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res) {
        const { store_id } = req.params

        const {
            attribute_name,
            attribute_value,
            variation_menu_order,
            upload_image_id,
            variable_sku,
            variable_enabled,
            variable_regular_price,
            variable_sale_price,
            variable_sale_price_dates_from,
            variable_sale_price_dates_to,
            variable_stock,
            variable_original_stock,
            variable_stock_status,
            variable_weight,
            variable_length,
            variable_width,
            variable_height,
            variable_shipping_class,
            variable_description,
            variation_id,
        } = req.body

        //Get user id by token
        const authHeader = req.headers.authorization

        const { user_id } = await UserByToken(authHeader, store_id)

        const store = await Store.findByPk(store_id, {
            include: { association: `user`, where: { id: user_id } },
        })

        if (!store) {
            return res.status(400).json({ error: 'Store informed not exists' })
        }

        //Check Name and Value Variation
        try {
            //Name
            const variablename = await Variation.findOne({
                where: { attribute_name, attribute_value, store_id, variation_id: null },
            })

            if (variablename)
                return res.status(400).json({
                    error: `The ${attribute_value} variation option already exists in the ${attribute_name} variation`,
                })
        } catch (error) {
            console.log(`Error in consult sku and name: `, error)
            return res.status(400).json({ error: 'problems consulting sku or name' })
        }

        try {
            //Create variation and mapping
            const variation = await Variation.create({
                attribute_name,
                attribute_value,
                variable_description,
                upload_image_id,
                variation_menu_order,
                variable_enabled,
                variation_id,
                store_id,
            })

            const infoVariation = await Variation.findByPk(variation.id, {
                include: { association: 'store', attributes: [`nameStore`, `email`, `url`] },
            })

            return res.json(infoVariation)
        } catch (error) {
            console.log(`Erro ao criar variação`, error)
            return res.status(400).send({ error })
        }
    },

    async uninformed(req, res) {
        return new Promise(async (resolve, reject) => {
            let { store_id: variable_store_id, product_id: variable_product_id } = req.params
            /* if(typeof(req.body.variations) == 'array'){
    
            } */

            const store = await Store.findByPk(variable_store_id)

            if (!store) {
                reject(Error('Store informed not exists'))
            }

            const product = await Product.findByPk(variable_product_id)

            if (!product) {
                reject(Error('Product informed not exists'))
            }

            for (const i in req.body.variations) {
                if (req.body.variations.i) {
                    const newvariation = req.body.variations[i]
                    const {
                        attribute_name,
                        attribute_value,
                        variation_menu_order,
                        upload_image_id,
                        variable_sku,
                        variable_enabled,
                        variable_regular_price,
                        variable_sale_price,
                        variable_sale_price_dates_from,
                        variable_sale_price_dates_to,
                        variable_stock,
                        variable_original_stock,
                        variable_stock_status,
                        variable_weight,
                        variable_length,
                        variable_width,
                        variable_height,
                        variable_shipping_class,
                        variable_description,
                    } = newvariation

                    const variablename = await Variation.findOne({ where: { attribute_name, attribute_value } }).catch(
                        (enm) => {
                            reject(Error(enm))
                        }
                    )

                    const variationSku = await Variation.findOne({ where: { variable_sku: variable_sku } }).catch(
                        (err) => {
                            reject(Error(err))
                        }
                    )
                    if (variationSku) {
                        return reject('Variation SKU informed already exists')
                    }

                    if (variablename) {
                        return reject(
                            `The "${attribute_value}" variation option already exists in the "${attribute_name}" variation`
                        )
                    }
                    try {
                        variable_store_id = parseInt(variable_store_id)
                        const variation = await Variation.create({
                            attribute_name,
                            attribute_value,
                            variation_menu_order,
                            upload_image_id,
                            variable_sku,
                            variable_enabled,
                            variable_regular_price,
                            variable_sale_price,
                            variable_sale_price_dates_from,
                            variable_sale_price_dates_to,
                            variable_stock,
                            variable_original_stock,
                            variable_stock_status,
                            variable_weight,
                            variable_length,
                            variable_width,
                            variable_height,
                            variable_shipping_class,
                            variable_description,
                            variable_store_id,
                        })
                            .then(async (result) => {
                                const { id } = result
                                let newreq = req
                                newreq.params['variation_id'] = parseInt(id)
                                await VariableMapConstroller.local(newreq)
                                    .then(async (r) => {
                                        resolve(result)
                                        console.log('Resultado do mapeamento: ', r)

                                        //const allvars = await Variation.findAll({ where: { id: }})
                                    })
                                    .catch(async (me) => {
                                        console.log('Error Mapping Variable', me)
                                        const mapvar = await Variation.destroy({
                                            where: { id },
                                            individualHooks: true,
                                        })
                                            .then((ve) => {
                                                reject(Error(ve))
                                            })
                                            .catch((er) => {
                                                reject(Error(er))
                                            })
                                    })
                            })
                            .catch((cer) => {
                                console.log(cer)
                                reject(Error(cer))
                            })
                    } catch (e) {
                        reject(Error(e))
                    }
                }
            }
        })
    },

    async delete(req, res) {
        try {
            const { variation_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const user = await User.findByPk(user_id)

            //super
            if (user.type == `super`) {
                const destroyMap = await VariationMap.destroy({ where: { variation_id } })
                const variationDestroy = await Variation.destroy({ where: { id: variation_id } })

                return res.status(200).send()
            }

            //check variation is store user
            const variation = await Variation.findByPk(variation_id, {
                include: {
                    association: `store`,
                    where: { user_id },
                },
            })

            if (!variation) return res.status(400).send({ error: `this variation does not belong to your store` })

            const destroyMap = await VariationMap.destroy({ where: { variation_id } })
            const variationDestroy = await Variation.destroy({ where: { id: variation_id } })

            return res.status(200).send()
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro listar endereço de entrega: `, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },
}
