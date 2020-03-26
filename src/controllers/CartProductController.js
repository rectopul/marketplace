const Store = require("../models/Stores");
const Client = require('../models/Client')
const jwt = require("jsonwebtoken");
const ClientMiddleware = require('../middlewares/ClientMiddleware')
const Cart = require('../models/Cart')
const CartProduct = require('../models/CartProduct')
const Product = require('../models/Product')
const Variation = require('../models/Variation')

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

            const variation = await Variation.findByPk(product_id)

            if (!variation)
                return res.status(400).send({ error: `This variation not exists` })


            //busca a loja pelo id do carrinho
            const cart = await Cart.findByPk(cart_id)

            if (!cart)
                return res.status(400).send({ error: `This cart not exists` })

            let values = {
                store_id: cart.store_id,
                cart_id,
                product_id,
                variation_id,
                quantity
            }

            const cartproduct = await CartProduct.create(values)

            return res.json(cartproduct)

        } catch (error) {
            console.log(`Erro ao adicionar produto no carrinho: `, error);
            return res.status(400).send({ error })
        }
    }
};
