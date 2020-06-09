/* eslint-disable no-async-promise-executor */
const Store = require('../models/Stores')
const Product = require('../models/Product')
const VariableMap = require('../models/VariationMap')
const Variation = require('../models/Variation')
const jwt = require('jsonwebtoken')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        try {
            const { product_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const variation = await Product.findByPk(product_id)
            //get store by variation
            const store = await Store.findOne({ where: { id: variation.store_id, user_id } })

            if (!store) return res.status(400).send({ error: `This variation does not belong to your store` })

            //get relationship
            const product = await Product.findByPk(product_id, {
                include: { association: `variations`, include: { association: `image` } },
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

            console.log(`Erro ao listar variação: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res) {
        try {
            const { variation_id, product_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const variation = await Variation.findByPk(variation_id)
            //get store by variation
            const store = await Store.findOne({ where: { id: variation.store_id, user_id } })

            if (!store) return res.status(400).send({ error: `This variation does not belong to your store` })

            //check if already exist variablemap
            const map = await VariableMap.findOne({ where: { store_id: variation.store_id, product_id } })

            if (map) return res.status(400).send({ error: `This product already belongs to this variation` })

            //get infos variation
            const {
                upload_image_id,
                variable_regular_price,
                variable_sale_price,
                variable_sale_price_dates_from,
                variable_sale_price_dates_to,
                variable_original_stock,
                variable_stock_status,
                variable_weight,
                variable_length,
                variable_width,
                variable_height,
                variable_stock,
                variable_shipping_class,
                variable_description,
            } = req.body

            const mapping = await VariableMap.create({
                upload_image_id,
                variable_regular_price,
                variable_sale_price,
                variable_sale_price_dates_from,
                variable_sale_price_dates_to,
                variable_original_stock,
                variable_stock_status,
                variable_weight,
                variable_length,
                variable_width,
                variable_height,
                variable_stock,
                variable_shipping_class,
                variable_description,
                store_id: variation.store_id,
                product_id,
                user_id,
                variation_id,
            })

            return res.json(mapping)
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

            console.log(`Erro ao mapear variação: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async local(req) {
        return new Promise(async (resolve, reject) => {
            const authHeader = req.headers.authorization
            let { store_id, product_id, variation_id } = req.params,
                decoded

            /**
             * Check if store pertenc for user by token
             */
            const [, token] = authHeader.split(' ')

            try {
                decoded = jwt.verify(token, process.env.APP_SECRET)
            } catch (e) {
                reject(Error('unauthorized'))
            }

            var id = decoded.id

            const StoreFromUser = await Store.findOne({ where: { user_id: id } })

            if (!StoreFromUser) {
                reject(Error('This store does not belong to the informed user'))
            }

            const variationmap = await VariableMap.create({
                store_id,
                product_id,
                user_id: parseInt(id),
                variation_id,
            })

            resolve(variationmap)
        })
    },
}
