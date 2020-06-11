const Product = require('../models/Product')
const Stores = require('../models/Stores')
const jwt = require('jsonwebtoken')
const VariationMap = require('../models/VariationMap')
const Variation = require('../models/Variation')
const User = require('../models/User')
const Image = require('../models/Image')
const userByToken = require('../middlewares/userByToken')
const ProductCategori = require('../models/CategoryMap')
const Category = require('../models/Categories')
const ProductImages = require('../models/ImageProduct')

module.exports = {
    async index(req, res) {
        const { order, orderby, paginate, page } = req.query

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
            limit: paginate || null,
            offset: paginate * (page - 1) || null,
            include: [
                { association: `images_product` },
                { association: `stores` },
                {
                    association: `variations`,
                    include: { association: `variation_info`, include: { association: `variations` } },
                },
                { association: `categories` },
            ],
        })

        //paginate infos
        const count = await Product.count()

        if (paginate) {
            const url = `${process.env.URL}/products?paginate=${paginate}${order ? '&order=' + order : ``}${
                orderby ? '&orderby=' + orderby : ''
            }&page=`
            const intCount =
                count / paginate > parseInt(count / paginate)
                    ? parseInt(count / paginate) + 1
                    : parseInt(count / paginate)
            const pageInfo = {
                total: intCount,
                current_page: `${url}${parseInt(page)}`,
                first_page: 1,
                first_page_url: `${url}${1}`,
                last_page: intCount,
                last_page_url: `${url}${intCount}`,
                next_page: parseInt(page) + 1 > intCount ? null : parseInt(page) + 1,
                next_page_url: parseInt(page) + 1 > intCount ? null : `${url}${parseInt(page) + 1}`,
                prev_page: page && page > 1 ? parseInt(page - 1) : null,
                prev_page_url: page && page > 1 ? `${url}${parseInt(page - 1)}` : null,
            }

            return res.json({ paginate: pageInfo, products })
        }

        return res.json(products)
    },

    async show(req, res) {
        try {
            const { product_id } = req.params

            const product = await Product.findByPk(product_id, {
                include: [
                    { association: `images_product` },
                    { association: `stores` },
                    { association: `variations` },
                    { association: `categories` },
                ],
            })

            return res.json(product)
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

            console.log(`Erro ao selecionar produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
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

    async admShow(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const { product_id } = req.params

            const product = await Product.findByPk(product_id, {
                include: [
                    { association: `images_product` },
                    { association: `stores`, where: { user_id } },
                    { association: `variations` },
                    { association: `categories` },
                ],
            })

            return res.json(product)
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

            console.log(`Erro ao selecionar produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async allstore(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            //get user

            const { order, orderby, paginate, page } = req.query

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
                limit: paginate || null,
                offset: paginate * (page - 1) || null,
                include: [
                    { association: `images_product` },
                    { association: `stores`, where: { user_id } },
                    {
                        association: `variations`,
                        include: { association: `variation_info` },
                    },
                    { association: `categories` },
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
        try {
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
                categories_id,
                images,
                reference,
                included_items,
                stock_alert,
                video,
            } = req.body

            const { user_id } = await userByToken(authHeader)

            const store = await Stores.findOne({ where: { user_id } })

            if (!store) {
                return res.status(400).json({ error: 'Store not exist' })
            }

            const store_id = store.id

            const productSku = await Product.findOne({ where: { sku, store_id: store.id } })

            if (productSku) return res.status(400).json({ error: 'Product SKU informed already exists' })

            if (!categories_id || !categories_id.length)
                return res.status(400).send({ error: `Please enter at least one category` })

            //check if categories exist
            await categories_id.foreach(async (category) => {
                const cat = await Category.findByPk(category)

                if (!cat) return res.status(400).send({ error: `Category by id ${category} not exist` })
            })

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
                reference,
                included_items,
                availability: stock ? `in_stock` : null,
                stock_alert,
                video,
            })

            //mapeando categoria

            await Promise.all(
                categories_id.map(async (category_id) => {
                    const category = await Category.findOne({ where: { id: category_id } })

                    if (category) {
                        return await ProductCategori.create({
                            category_id,
                            user_id,
                            store_id,
                            product_id: product.id,
                        })
                    }
                })
            )

            //Imagens
            if (images && images.length) {
                await Promise.all(
                    images.map(async (image_id) => {
                        //check images is other product
                        const checkImage = await ProductImages.findOne({ where: { id: image_id } })

                        //check if image exist
                        if (!checkImage) return res.status(400).send({ error: `This image not exist` })

                        //check images is other product
                        if (checkImage.product_id)
                            return res.status(400).send({ error: `This image already belongs to another product` })

                        await ProductImages.update({ product_id: product.id }, { where: { id: image_id } })
                    })
                )
            }

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

                // eslint-disable-next-line no-unused-vars
                const resulveVariations = await Promise.all(mapVariations)

                //Validar se a variação já existe
                const resProduto = await Product.findByPk(product.id, {
                    include: [
                        { association: `stores`, attributes: [`nameStore`, `email`, `url`] },
                        { association: `images_product` },
                        {
                            association: `variations`,
                            include: { association: `variation_info`, include: { association: `variation` } },
                        },
                        {
                            association: `categories`,
                            attributes: [`category_id`],
                            include: { association: `category` },
                        },
                    ],
                })

                return res.json(resProduto)
            } else {
                //retorno de produto
                const resProduto = await Product.findByPk(product.id, {
                    include: [
                        { association: `stores`, attributes: [`nameStore`, `email`, `url`] },
                        { association: `images_product` },
                        { association: `variations`, include: { association: `variation_info` } },
                        {
                            association: `categories`,
                            attributes: [`category_id`],
                            include: { association: `category` },
                        },
                    ],
                })

                return res.json(resProduto)
            }
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
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

            //Pegar id do usuário a partir do token
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            //Check store of product
            const productStore = await Product.findByPk(product_id)

            if (!productStore) return res.status(400).send({ error: `product not exist` })

            const store_id = productStore.store_id

            const store = await Stores.findOne({ where: { id: store_id, user_id } })

            if (!store)
                return res.status(400).send({
                    error: `This product does not belong to this user`,
                })

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
                categories_id,
                images,
                reference,
                included_items,
                availability,
                stock_alert,
                video,
            } = req.body

            await Product.update(
                {
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
                    reference,
                    included_items,
                    availability,
                    stock_alert,
                    video,
                },
                {
                    where: { id: product_id },
                    returning: true,
                    plain: true,
                }
            )

            if (categories_id) {
                await Promise.all(
                    categories_id.map(async (category_id) => {
                        const category = await Category.findOne({ where: { id: category_id } })

                        await ProductCategori.destroy({ where: { category_id, product_id } })

                        if (category) {
                            return await ProductCategori.create({
                                category_id,
                                user_id,
                                store_id,
                                product_id,
                            })
                        }
                    })
                )
            }

            //Imagens
            if (images && images.length) {
                await Promise.all(
                    images.map(async (image_id) => {
                        await ProductImages.update({ product_id }, { where: { id: image_id } })
                    })
                )
            }

            //retorno de produto
            const resProduto = await Product.findByPk(product_id, {
                include: [
                    { association: `stores`, attributes: [`nameStore`, `email`, `url`] },
                    { association: `images_product` },
                    { association: `variations`, include: { association: `variation_info` } },
                    {
                        association: `categories`,
                        attributes: [`category_id`],
                        include: { association: `category` },
                    },
                ],
            })

            return res.status(200).send(resProduto)
        } catch (error) {
            console.log(`Erro ao Atualizar Produto`, error)
            return res.status(400).send({ error })
        }
    },
}
