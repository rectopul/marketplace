const Store = require("../models/Stores");
const Client = require('../models/Client')
const User = require('../models/User')
const jwt = require("jsonwebtoken");
const ClientMiddleware = require('../middlewares/ClientMiddleware')
const Cart = require('../models/Cart')
const CartProduct = require('../models/CartProduct')
const Product = require('../models/Product')
const Variation = require('../models/Variation')
const VariationMap = require('../models/VariationMap')
const Image = require('../models/Image')

module.exports = {
    async create(req, res) {
        try {

            const { product_id, variation_id, quantity } = req.body

            const { cart_id } = req.params

            if (!product_id && !variation_id && !quantity)
                return res.status(400).send({ error: `The product_id, variation_id and quantity fields are mandatory` })


            //Verifica se o produto e a variação existe
            const product = await Product.findByPk(product_id)

            if (!product)
                return res.status(400).send({ error: `This product not exists` })

            const variation = await VariationMap.findOne({ where: { id: variation_id, product_id } })

            if (!variation)
                return res.status(400).send({ error: `This variation not exists` })

            //busca a loja pelo id do carrinho
            const cart = await Cart.findByPk(cart_id)

            if (!cart)
                return res.status(400).send({ error: `This cart not exists` })

            //Verifica de este produto e variação já existe para atualizar a quantidade
            const productInCart = await CartProduct.findOne({ where: { cart_id, product_id, variation_id } })

            if (productInCart) {
                const newQuantity = productInCart.quantity + quantity
                const updateQuantity = await CartProduct.update({ quantity: newQuantity }, { where: { cart_id, product_id, variation_id } })

            } else {

                let values = {
                    cart_id,
                    product_id,
                    variation_id,
                    quantity
                }

                const cartproduct = await CartProduct.create(values)
            }

            //Get Cart association
            const assocCart = await Cart.findByPk(cart_id, {
                include: {
                    association: `cartProducts`,
                    attributes: [`quantity`],
                    include: [
                        {
                            association: `product`,
                            attributes: { exclude: [`createdAt`, `updatedAt`,] },
                            include: { association: `images_product` }
                        },
                        {
                            association: `variation`,
                            include: {
                                association: `image`,
                                attributes: [`url`, `name`]
                            }
                        }
                    ]
                }
            })

            return res.json(assocCart)

        } catch (error) {
            console.log(`Erro ao adicionar produto no carrinho: `, error);
            return res.status(500).send({ error })
        }
    },

    async remove(req, res) {
        try {
            //Usuário anonimo
            const { cart_id, session_id } = req.params

            const { product_id, variation_id } = req.body

            //Usuário logado
            const authHeader = req.headers.authorization

            if (authHeader) {
                const { user_id, client_id } = await UserByToken(authHeader)

                if (client_id) {
                    const cart = await Cart.findOne({ where: { client_id } })

                    if (!cart)
                        return res.status(400).send({ error: `This cart not exists` })

                    //if is variation
                    const product = await Product.destroy({ where: { product_id, variation_id, client_id } })

                    //Return cart
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
                        where: { id: cart_id, client_id }
                    })

                    return res.json(carts)
                }

                if (user_id) {

                    //Pegar o usuario
                    const user = await User.findByPk(user_id)

                    const cart = await Cart.findByPk(cart_id)

                    if (!cart)
                        return res.status(400).send({ error: `This cart not exists` })

                    //Check store
                    const store = await Store.findByPk(cart.store_id)

                    //Aguardando a configuração dos managers
                    if (user.type != `storeAdministrator` || user.type != `storeManager` && !store)
                        return res.status(400).send({ error: `This user is not allowed to delete this product from the cart` })

                    //if is variation
                    const product = await Product.destroy({ where: { product_id, variation_id, client_id } })

                    //Return cart
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
                        where: { id: cart_id, client_id }
                    })

                    return res.json(carts)
                }
            }

            //Check if Cart exists
            const cart = await Cart.findByPk(cart_id)

            if (!cart)
                return res.status(400).send({ error: `This cart not exists` })

            //Caso tenha variação
            if (product_id && variation_id) {
                const deleteProductVariation = await CartProduct.destroy({ where: { product_id, variation_id } })
            }

            if (product_id && !variation_id) {
                const deleteProduct = await CartProduct.destroy({ where: { product_id } })
            }

            //Get Cart association
            const assocCart = await Cart.findByPk(cart_id, { include: { association: `cartProducts` } })

            let cartJson = assocCart.toJSON()

            const resCart = cartJson.cartProducts.map(async product => {
                const productInfos = await Product.findByPk(product.product_id)

                //Produto
                product.product_sku = productInfos.sku
                product.product_except = productInfos.except
                product.product_title = productInfos.title
                product.product_description = productInfos.description
                product.product_brand = productInfos.brand
                product.product_model = productInfos.model

                //Variação
                if (product.variation_id) {
                    const variationMapInfos = await VariationMap.findByPk(product.variation_id)
                    const variationInfos = await Variation.findByPk(variationMapInfos.variation_id)

                    product.product_variation_name = variationInfos.attribute_name
                    product.product_variation_value = variationInfos.attribute_value
                    product.product_variation_price = parseFloat(variationMapInfos.variable_regular_price)

                    if (variationMapInfos.variable_sale_price)
                        product.product_variation_sale_price = parseFloat(variationMapInfos.variable_sale_price)

                    product.product_variation_variable_description = variationMapInfos.variable_description

                    if (variationMapInfos.upload_image_id) {
                        const productVariationImage = await Image.findByPk(variationMapInfos.upload_image_id)
                        product.product_variation_image = productVariationImage.url
                    }

                    return product
                }
            })

            cartJson.cartProducts = await Promise.all(resCart)

            return res.json(cartJson)
        } catch (error) {
            return res.status(400).send({ error })
        }
    }
};
