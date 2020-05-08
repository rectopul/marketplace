const Product = require('../models/Product')
const Stores = require('../models/Stores')
const jwt = require('jsonwebtoken')
const VariationMap = require('../models/VariationMap')
const Variation = require('../models/Variation')
const User = require('../models/User')
const Image = require('../models/Image')

module.exports = {
    async index(req, res) {
        const { product_id } = req.params

        const product = await Product.findByPk(product_id, {
            include: [
                { association: `images_product` },
                { association: `stores` },
                { association: `variations` },
                { association: `product_categories_map` },
            ],
        })

        return res.json(product)
    },

    async store(req, res) {
        const { store_id, product_id } = req.params

        const store = await Stores.findByPk(store_id)

        const products = await Product.findByPk(product_id)

        if (!store) {
            return res.status(400).json({ error: 'Store not exist' })
        }

        return res.json(products)
    },

    async allstore(req, res) {
        try {
            const { limit, order, orderby, offset } = req.query

            const filters = [
                `title`,
                `sku`,
                `description`,
                `stock`,
                `weight`,
                `price`,
                `promotional_price`,
                `brand`,
                `model`,
            ]

            if (order && [`ASC`, `DESC`].indexOf(order) == -1)
                return res.status(400).send({ error: `The order parameter accepts the 'ASC' or 'DESC' values` })

            if (orderby && filters.indexOf(orderby) == -1)
                return res.status(400).send({ error: `orderby parameter does not exist` })

            const products = await Product.findAll({
                order: order ? (orderby ? [[orderby, order]] : [['createdAt', order]]) : null,
                limit: parseInt(limit) || null,
                offset: parseInt(offset) || null,
                include: [
                    { association: `images_product` },
                    { association: `stores` },
                    {
                        association: `variations`,
                        include: { association: `variation_info` },
                    },
                    { association: `product_categories_map` },
                ],
            })

            return res.json(products)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro listar endereço de entrega: `, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },

    async create(req, res) {
        const { store_id } = req.params

        const authHeader = req.headers.authorization
        const {
            sku,
            title,
            description,
            except,
            stock,
            weight,
            width,
            height,
            length,
            price,
            promotional_price,
            cust_price,
            brand,
            model,
            frete_class,
        } = req.body

        var decoded

        const store = await Stores.findByPk(store_id)

        if (!store) {
            return res.status(400).json({ error: 'Store not exist' })
        }

        const [, token] = authHeader.split(' ')

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            return res.status(401).send({ error: 'unauthorized' })
        }

        var user_id = decoded.id

        try {
            // Fetch the user by id
            const StoreFromUser = await Stores.findOne({ where: { user_id } })

            if (!StoreFromUser) {
                return res.status(400).json({
                    error: 'This store does not belong to the informed user',
                })
            }

            const productSku = await Product.findOne({ where: { sku } })

            if (productSku) return res.status(400).json({ error: 'Product SKU informed already exists' })
        } catch (error) {
            return res.status(400).send({ error: `Error in validation informations of product` })
        }

        try {
            let product = await Product.create({
                sku,
                title,
                description,
                except,
                stock,
                weight,
                width,
                height,
                length,
                price,
                promotional_price,
                cust_price,
                brand,
                model,
                frete_class,
                store_id,
            })

            if (req.body.variations) {
                const { variations } = req.body

                const mapVariations = variations.map(async (variation) => {
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
                    } = variation

                    //Check Name and Value Variation
                    try {
                        //Name
                        const variablename = await Variation.findOne({
                            where: {
                                attribute_name,
                                attribute_value,
                                store_id,
                            },
                        })

                        //SKU
                        if (variable_sku) {
                            const variationSku = await VariationMap.findOne({
                                where: { variable_sku, store_id },
                            })

                            if (variationSku)
                                return res.status(400).json({
                                    error: `Green ${attribute_name} ${attribute_value} not created because ${variable_sku} already exists`,
                                })
                        }

                        if (variablename) {
                            const variationExisting = await VariationMap.create(
                                {
                                    user_id,
                                    store_id,
                                    product_id: product.id,
                                    variation_id: variablename.id,
                                    variable_sku,
                                    upload_image_id,
                                    variable_regular_price,
                                    variable_sale_price,
                                    variable_sale_price_dates_from,
                                    variable_sale_price_dates_to,
                                    variable_stock,
                                    variable_stock_status,
                                    variable_original_stock,
                                    variable_weight,
                                    variable_length,
                                    variable_width,
                                    variable_height,
                                    variable_shipping_class,
                                    variable_description,
                                },
                                { raw: true }
                            )

                            let jsonVariationExisting = variationExisting.toJSON()

                            let mountResponse = jsonVariationExisting

                            mountResponse.attribute_name = attribute_name
                            mountResponse.attribute_value = attribute_value
                            mountResponse.variable_description = variable_description

                            //Busca pela imagem
                            if (upload_image_id) {
                                const productVariationImage = await Image.findByPk(upload_image_id)
                                mountResponse.upload_image = productVariationImage.url
                                delete mountResponse.upload_image_id
                            }

                            mountResponse.variation_menu_order = variation_menu_order
                            mountResponse.variable_enabled = variable_enabled

                            return mountResponse
                        } else {
                            const createVariation = await Variation.create({
                                attribute_name,
                                attribute_value,
                                variable_description,
                                variation_menu_order,
                                variable_enabled,
                                store_id,
                            })

                            let variationmap = await VariationMap.create(
                                {
                                    user_id,
                                    store_id,
                                    product_id: product.id,
                                    variation_id: createVariation.id,
                                    variable_sku,
                                    upload_image_id,
                                    variable_regular_price,
                                    variable_sale_price,
                                    variable_sale_price_dates_from,
                                    variable_sale_price_dates_to,
                                    variable_stock,
                                    variable_stock_status,
                                    variable_original_stock,
                                    variable_weight,
                                    variable_length,
                                    variable_width,
                                    variable_height,
                                    variable_shipping_class,
                                    variable_description,
                                },
                                { raw: true }
                            )

                            let jsonVariationExisting = variationmap.toJSON()
                            //Montar Retorno
                            let mountResponse = jsonVariationExisting

                            mountResponse.attribute_name = attribute_name
                            mountResponse.attribute_value = attribute_value
                            mountResponse.variable_description = variable_description

                            //Busca pela imagem
                            if (upload_image_id) {
                                const productVariationImage = await Image.findByPk(upload_image_id)
                                mountResponse.upload_image = productVariationImage.url
                                delete mountResponse.upload_image_id
                            }

                            mountResponse.variation_menu_order = variation_menu_order
                            mountResponse.variable_enabled = variable_enabled

                            return mountResponse
                        }
                    } catch (error) {
                        console.log(`Error in consult sku and name: `, error)
                        return res.status(400).json({ error: 'problems consulting sku or name' })
                    }
                })

                const resulveVariations = await Promise.all(mapVariations)

                let jsonProduct = product.toJSON()
                jsonProduct.variations = resulveVariations
                //Validar se a variação já existe
                return res.json(jsonProduct)
            } else {
                return res.json(product)
            }
        } catch (error) {
            console.log(`Erro ao criar produto: `, error)
            return res.status(400).send({ error: `Error in create product` })
        }
    },

    async productDelete(req, res) {
        try {
            //Id do produto
            const { product_id } = req.params

            //Pegar id do usuário a partir do token
            const authHeader = req.headers.authorization
            const [, token] = authHeader.split(' ')

            let decoded = jwt.verify(token, process.env.APP_SECRET)

            var user_id = decoded.id
            //Verifica se o usuário é um administrador geral
            const isadmin = await User.findByPk(user_id, {
                include: { association: 'stores' },
            })

            const listStores = isadmin.stores.map((store) => {
                return store.id
            })

            //Pegar id da loja ao qual o produto pertence
            const storeid = await Product.findByPk(product_id)

            if (isadmin == `super` || isadmin == `storeAdministrator`) {
                await Product.destroy({ where: { id: product_id } })
            } else {
                //Verifica a loja do produto e se ela pertence a este usuário
                if (!listStores.includes(storeid.store_id))
                    return res.status(400).send({
                        error: `This product does not belong to this user`,
                    })

                await Product.destroy({ where: { id: product_id } })
            }

            //Delete variations map
            await VariationMap.destroy({
                where: { product_id },
            })

            return res.status(200).send()
        } catch (error) {
            return res.status(400).send({ error: error })
        }
    },

    async productUpdate(req, res) {
        try {
            const { product_id } = req.params

            //Campos não editáveis
            //delete fields not updated
            if (req.body.store_id) return res.status(400).send({ error: `Cannot change the product store` })

            //Pegar id do usuário a partir do token
            const authHeader = req.headers.authorization
            const [, token] = authHeader.split(' ')

            let decoded = jwt.verify(token, process.env.APP_SECRET)

            const user_id = decoded.id

            //Check store of product
            const productStore = await Product.findByPk(product_id)

            //console.log(`Produto: `, productStore);

            const store_id = productStore.store_id

            const store = await Stores.findOne({
                where: { id: store_id, user_id },
            })

            if (!store)
                return res.status(400).send({
                    error: `This product does not belong to this user`,
                })

            let updateValues = {}

            Object.keys(req.body).map((item) => {
                if (req.body[item] != undefined && item != `id`) return (updateValues[item] = req.body[item])
            })

            const product = await Product.update(updateValues, {
                where: { id: product_id },
                returning: true,
                plain: true,
            })

            return res.status(200).send(product[1])
        } catch (error) {
            console.log(`Erro ao Atualizar Produto`, error)
            return res.status(400).send({ error })
        }
    },
}
