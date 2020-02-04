const Store = require('../models/Stores')
const Product = require("../models/Product");
const ProductsVariation = require('../models/ProductVariations')

module.exports = {
    async index(req, res) {
        const { id } = req.params;

        const variation = await Variation.findByPk(id).then(result => {
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

                    const variationSku = await ProductsVariation.findOne({ where: { 'variable_sku': variable_sku } })
                        .catch(err => {
                            reject(Error(err));
                        })
                    if (variationSku) {
                        reject(Error("Variation SKU informed already exists"))
                    }

                    try {
                        variable_store_id = parseInt(variable_store_id)
                        const variation = await ProductsVariation.create({
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
                            variable_product_id
                        }).then(result => {
                            resolve(result)

                        }).catch(cer => {
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
