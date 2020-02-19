const Product = require("../models/Product");
const Stores = require("../models/Stores");
const jwt = require('jsonwebtoken')
const VariationController = require('./VariationController')
const VariableMapConstroller = require('./VariableMapController')
const VariationMap = require('../models/VariationMap')
const VariationMapVariation = require('../models/Variation')
const Variation = require('../models/Variation')

module.exports = {
    async index(req, res) {
        const { store_id } = req.params;

        const store = await Stores.findByPk(store_id, {
            include: { association: "products" }
        });

        return res.json(store);
    },

    async store(req, res) {
        const { store_id, product_id } = req.params;

        const store = await Stores.findByPk(store_id);

        const products = await Product.findByPk(product_id);

        if (!store) {
            return res.status(400).json({ error: "Store not exist" });
        }

        return res.json(products);
    },

    async create(req, res) {
        const { store_id } = req.params;
        const authHeader = req.headers.authorization;
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
        } = req.body;

        var decoded

        const store = await Stores.findByPk(store_id);

        if (!store) {
            return res.status(400).json({ error: "Store not exist" });
        }

        const [, token] = authHeader.split(" ");

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            return res.status(401).send({ error: 'unauthorized' });
        }

        var id = decoded.id;

        // Fetch the user by id 
        const StoreFromUser = await Stores.findOne({ where: { "user_id": id } })

        if (!StoreFromUser) {
            return res.status(400).json({ error: "This store does not belong to the informed user" });
        }

        const productSku = await Product.findOne({ where: { sku } })

        if (productSku) {
            return res.status(400).json({ error: "Product SKU informed already exists" });
        }

        const product = await Product.create({
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
            store_id
        })
            .then(async (product) => {
                const { variations } = req.body
                if (variations) {
                    const { id: product_id } = product

                    let variationresponse = []

                    const skus = variations.map(item => { return item.variable_sku })

                    variationsku = await Variation.findAll({ where: { variable_sku: skus } })

                    if (variationsku.length) {
                        console.log('Var skus: ', variationsku);

                        const delprod = await Product.destroy({
                            where: { id: product_id },
                            individualHooks: true
                        }).then(prodel => { console.log('Produto com id Deletado: ', product_id); })

                        return res.status(400).json({ error: `This skus already exists`, skus: variationsku });
                    }

                    for (const i in variations) {
                        if (variations.hasOwnProperty(i)) {
                            var variat = variations[i];


                            let objectvariation = {
                                msg: '',
                                variation: ''
                            }

                            const { attribute_name, attribute_value, variable_sku } = variat

                            const conultvariation = await Variation.findOne({ where: { attribute_name, attribute_value } })

                            if (conultvariation) {
                                objectvariation.msg = `The variation ${attribute_name} with ${attribute_value} already exists`

                                let { id: variation_id } = conultvariation

                                const mapeament = await VariationMap.create({
                                    store_id,
                                    product_id,
                                    user_id: id,
                                    variation_id
                                })
                                    .then(mp1 => {
                                        objectvariation.variation = conultvariation
                                    })
                                    .catch(async mp1err => {
                                        console.log('Error map1: ', mp1err);

                                        const delprod = await Product.destroy({
                                            where: { id: product_id },
                                            individualHooks: true
                                        }).then(prodel => { console.log('Produto com id Deletado: ', product_id); })

                                        return res.status(400).json({ error: `The variation ${attribute_name} with ${attribute_value} not mepead` });
                                    })


                            } else {
                                variat.variable_store_id = parseInt(store_id)

                                const insertvar = await Variation.create(variat)
                                    .then(async resvar2 => {
                                        let { id: variation_id } = resvar2

                                        const mapeament = await VariationMap.create({
                                            store_id,
                                            product_id,
                                            user_id: id,
                                            variation_id
                                        })

                                        objectvariation.variation = resvar2
                                    })
                                    .catch(async mp2err => {
                                        console.log('Error Map2: ', mp2err);

                                        const delprod = await Product.destroy({
                                            where: { id: product_id },
                                            individualHooks: true
                                        }).then(prodel => { console.log('Produto com id Deletado: ', product_id); })

                                        return res.status(400).json({ error: `The variation ${attribute_name} with ${attribute_value} not mepead` });
                                    })
                            }

                            variationresponse.push(objectvariation)
                        }
                    }

                    productandvar = product.toJSON()

                    productandvar.variations = variationresponse

                    return res.json(productandvar);

                } else {
                    return res.json(product);
                }

            })
            .catch((proderr) => {
                console.log(proderr)
            })

    }

};
