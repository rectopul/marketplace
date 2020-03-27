const Store = require('../models/Stores')
const Product = require("../models/Product");
const Variation = require('../models/Variation')
const VariationMap = require('../models/VariationMap')
const VariableMapConstroller = require('./VariableMapController')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        const { product_id } = req.params;

        const prodvariationmap = await Product.findByPk(product_id, {
            include: { association: "variations" }
        })

        let variations_id = []

        for (const i in prodvariationmap.variations) {
            if (prodvariationmap.variations.hasOwnProperty(i)) {
                const variationmap = prodvariationmap.variations[i];
                const { variation_id } = variationmap
                variations_id.push(variation_id)
            }
        }

        const variation = await Variation.findAll({
            where: {
                id: variations_id
            }
        }).then(result => {
            return res.json(result);
        })

    },

    async mult(req, res) {
        const { store_id, product_id } = req.params;

        const store = await Store.findByPk(store_id);

        if (!store) {
            return res.status(400).json({ error: "Store informed not exists" });
        }

        const product = await Product.findByPk(product_id, {
            include: { association: "product_variations" }
        });

        if (!product) {
            return res.status(400).json({ error: "Product informed not exists" });
        }

        return res.json(product);
    },

    async update(req, res) {
        const { store_id, variation_id } = req.params;
        const { name, options } = req.body;

        const store = await Store.findByPk(store_id);

        if (!store) {
            return res.status(400).json({ error: "Store informed not exists" });
        }

        const variation = await Variation.update({
            name,
            options
        }, {
            where: { id: variation_id }
        }).then(result => {
            Variation.findByPk(variation_id).then(response => {
                return res.json(response);
            })
        }).catch(err => {
            res.status(400).json({ error: err })
            console.log(err)
        })


    },

    async store(req, res) {
        const { store_id } = req.params
        const {
            product_id,
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
            variable_description
        } = req.body

        const store = await Store.findByPk(store_id)

        if (!store) {
            return res.status(400).json({ error: "Store informed not exists" })
        }

        /**
         * Check product Exists
         */
        if (product_id) {
            var product = await Product.findByPk(product_id)

            if (!product) {
                return res.status(400).json({ error: "Product ID informed not exists" })
            }
        }

        //Check Name and Value Variation
        try {

            //Name
            const variablename = await Variation.findOne({ where: { attribute_name, attribute_value, store_id } })

            if (variablename)
                return res.status(400).json({ error: `The ${attribute_value} variation option already exists in the ${attribute_name} variation` })

            //SKU
            if (variable_sku) {
                const variationSku = await VariationMap.findOne({
                    where: {
                        variable_sku,
                        store_id
                    }
                })

                if (variationSku)
                    return res.status(400).json({ error: "Variation SKU informed already exists" })
            }

        } catch (error) {
            console.log(`Error in consult sku and name: `, error);
            return res.status(400).json({ error: "problems consulting sku or name" })
        }

        try {

            //Get user id by token
            const authHeader = req.headers.authorization;

            const user_id = await UserByToken(authHeader, store_id)

            //Create variation and mapping
            const variation = await Variation.create({
                attribute_name,
                attribute_value,
                variable_description,
                upload_image_id,
                variation_menu_order,
                variable_enabled,
                store_id
            })


            if (product_id) {
                const variationmap = await VariationMap.create({
                    user_id,
                    store_id,
                    product_id,
                    variation_id: variation.id,
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
                    variable_description
                })
            }


            const infoVariation = await Variation.findByPk(variation.id, { include: { association: "productVariation" } })

            return res.json(infoVariation)
        } catch (error) {
            console.log(`Erro ao criar variação`, error);
            return res.status(400).send({ error })
        }
    },

    async uninformed(req, res) {
        return new Promise(async (resolve, reject) => {
            let { store_id: variable_store_id, product_id: variable_product_id } = req.params;
            /* if(typeof(req.body.variations) == 'array'){
    
            } */

            const store = await Store.findByPk(variable_store_id);

            if (!store) {
                reject(Error("Store informed not exists"))
            }

            const product = await Product.findByPk(variable_product_id);

            if (!product) {
                reject(Error("Product informed not exists"))
            }

            for (const i in req.body.variations) {
                if (req.body.variations.hasOwnProperty(i)) {
                    const newvariation = req.body.variations[i];
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
                        variable_description } = newvariation

                    const variablename = await Variation.findOne({ where: { attribute_name, attribute_value } })
                        .catch(enm => {
                            reject(Error(enm));
                        })

                    const variationSku = await Variation.findOne({ where: { 'variable_sku': variable_sku } })
                        .catch(err => {
                            reject(Error(err));
                        })
                    if (variationSku) {
                        return reject("Variation SKU informed already exists")
                    }

                    if (variablename) {
                        return reject(`The "${attribute_value}" variation option already exists in the "${attribute_name}" variation`)
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
                            variable_store_id
                        }).then(async result => {
                            const { id } = result
                            let newreq = req
                            newreq.params['variation_id'] = parseInt(id)
                            await VariableMapConstroller.local(newreq)
                                .then(async r => {
                                    resolve(result)
                                    console.log('Resultado do mapeamento: ', r);

                                    //const allvars = await Variation.findAll({ where: { id: }})
                                })
                                .catch(async me => {
                                    console.log('Error Mapping Variable', ve);
                                    const mapvar = await Variation.destroy({
                                        where: { id },
                                        individualHooks: true
                                    })
                                        .then((ve) => {
                                            reject(Error(ve))
                                        })
                                        .catch((er) => {
                                            reject(Error(er))
                                        })
                                })

                        }).catch(cer => {
                            console.log(cer)
                            reject(Error(cer))
                        })
                    } catch (e) {
                        reject(Error(e))
                    }

                }
            }
        })
    }
};
