const Product = require("../models/Product");
const Stores = require("../models/Stores");
const jwt = require('jsonwebtoken')
const VariationController = require('./VariationController')
const VariableMapConstroller = require('./VariableMapController')

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
                    const { id } = product
                    let newreq = req
                    newreq.params['product_id'] = parseInt(id)

                    await VariationController.uninformed(newreq)
                        .then(async result => {
                            try {
                                const prodvariate = await Product.findByPk(id, {
                                    include: { association: "variations" }
                                });

                                await VariableMapConstroller.indexLocal(newreq)
                                    .then(nmaps => {
                                        let ProdVariation = product.toJSON()
                                        ProdVariation['variations'] = result
                                        return res.json(ProdVariation);
                                    })
                                    .catch(mapserr => {
                                        console.log(mapserr)
                                        return res.status(400).json({ error: "Error in select variations" });
                                    })


                            } catch (e) {
                                const productdel = await Product.destroy({
                                    where: { id },
                                    individualHooks: true
                                })
                                    .then((ev) => {
                                        return res.status(400).json({ error: "Error in insert variation" });
                                    })
                                    .catch((er) => {
                                        console.log(er)
                                    })
                            }

                        })
                        .catch(async err => {
                            console.log(err);

                            const productdel = await Product.destroy({
                                where: { id },
                                individualHooks: true
                            })
                                .then((ev) => {
                                    return res.status(400).json({ Error: err });
                                })
                                .catch((e) => {
                                    console.log(e)
                                })
                        })
                } else {
                    return res.json(product);
                }

            })
            .catch((proderr) => {
                console.log(proderr)
            })

    }

};
