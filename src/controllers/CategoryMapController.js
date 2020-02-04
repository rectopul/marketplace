const Store = require("../models/Stores");
const CategoyMap = require('../models/CategoryMap')
const Categories = require("../models/Categories");
const User = require('../models/User')
const Product = require('../models/Product')

module.exports = {
    async index(req, res) {
        const { store_id } = req.params;

        const store = await Store.findByPk(store_id, {
            include: { association: "categories" }
        });

        return res.json(store);

    },

    async store(req, res) {
        return new Promise(async resolve => {
            const { store_id, category_id, user_id, product_id } = req;

            /* Check User */
            const user = await User.findByPk(user_id);
            if (!user) {
                throw TypeError("User informed not exists")
            }

            /* Check Store */
            const store = await Store.findByPk(store_id).catch(err => {

            })

            if (!store) {
                throw TypeError("Store informed not exists")
                //return { error: "Store informed not exists" };
            }

            /* Check Category */
            const category = await Categories.findByPk(category_id);

            if (!category) {
                throw TypeError("Category informed not exists")
                //return { error: "Category informed not exists" };
            }

            /**
             * Check Product
             */
            if (product_id) {
                const product = await Product.findByPk(product_id);

                if (!product) {
                    throw TypeError("Product informed not exists")
                    //{ error: "Product informed not exists" };
                }
            }

            const categorymap = await CategoyMap.create({
                user_id,
                store_id,
                category_id,
                product_id
            }).then(result => {
                const res = {
                    status: 200,
                    json: result
                }

                resolve(res);

            }).catch(err => {
                console.log('Erro', err);
            });
        });
    }
};
