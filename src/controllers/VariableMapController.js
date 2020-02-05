const User = require('../models/User');
const Store = require('../models/Stores')
const Product = require('../models/Product')
const VariableMap = require('../models/VariationMap')
const Variation = require('../models/Variation')
const jwt = require('jsonwebtoken')
const { promisify } = require("util");

module.exports = {
    async index(req, res) {
        const { product_id } = req.params;
        const prodvariate = await Product.findByPk(product_id, {
            include: { association: "variations" }
        })
            .then(result => {
                return res.json(prodvariate);
            })
            .catch(err => {
                return res.status(400).json({ error: "Error in select variations" });
            })
    },

    async indexLocal(req) {
        return new Promise(async (resolve, reject) => {
            const { product_id: id } = req.params;
            const prodvariate = await Product.findByPk(id, {
                include: { association: "variations" }
            })
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    reject("Error in association variations")
                })
        })
    },

    async store(req, res) {
        const authHeader = req.headers.authorization;
        const { store_id, product_id, variation_id } = req.body
        var promount = {}

        var product = await Product.findByPk(product_id)
        var variation = await Variation.findByPk(variation_id)

        if (!product) {
            return res.status(400).json({ error: "Product informed not exists" });
        }

        if (!variation) {
            return res.status(400).json({ error: "Variation informed not exists" });
        }

        const prodandvar = await VariableMap.findOne({ where: { product_id, variation_id } })

        if (prodandvar) {
            return res.status(400).json({ error: "This variation is already registered in this product" });
        }

        promount['product'] = product
        promount['variation'] = [variation]


        /**
         * Check if store pertenc for user by token
         */
        const [, token] = authHeader.split(" ");

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            reject(Error("unauthorized"))
        }

        var id = decoded.id;

        const StoreFromUser = await Store.findOne({ where: { "user_id": id } })

        if (!StoreFromUser) {
            return res.status(400).json({ error: "This store does not belong to the informed user" });
        }

        const variationmap = await VariableMap.create({
            store_id,
            product_id,
            user_id: parseInt(id),
            variation_id
        })

        //promount['variation'] = [variation]

        return res.json(promount);
    },

    async local(req) {
        return new Promise(async (resolve, reject) => {
            const authHeader = req.headers.authorization;
            let { store_id, product_id, variation_id } = req.params,
                decoded

            /**
             * Check if store pertenc for user by token
             */
            const [, token] = authHeader.split(" ");

            try {
                decoded = jwt.verify(token, process.env.APP_SECRET)
            } catch (e) {
                reject(Error("unauthorized"))
            }

            var id = decoded.id;

            const StoreFromUser = await Store.findOne({ where: { "user_id": id } })

            if (!StoreFromUser) {
                reject(Error("This store does not belong to the informed user"))
            }

            const variationmap = await VariableMap.create({
                store_id,
                product_id,
                user_id: parseInt(id),
                variation_id
            })

            resolve(variationmap)
        })
    }
};
