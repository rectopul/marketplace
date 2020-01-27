const Store = require('../models/Stores')
const Product = require("../models/Product");
const Variation = require('../models/Variation')

module.exports = {
    async index(req, res) {
        const { id } = req.params;

        const variation = await Variation.findByPk( id ).then( result => {
            return res.json(result);
        })

    },

    async mult(req, res){
        const { store_id, product_id } = req.params;

        const store = await Store.findByPk(store_id);

        if(!store){
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

    async update(req, res){
        const { store_id, variation_id } = req.params;
        const { name, options } = req.body;

        const store = await Store.findByPk(store_id);

        if(!store){
            return res.status(400).json({ error: "Store informed not exists" });
        }

        const variation = await Variation.update({
            name,
            options
        },{
            where: { id: variation_id }
        }).then( result => {
            Variation.findByPk(variation_id).then( response => {
                return res.json(response);
            })
        }).catch( err => {
            res.status(400).json({ error: err })
            console.log(err)
        })

        
    },

    async store(req, res) {
        const { store_id, product_id } = req.params;
        const { name, options } = req.body;

        const store = await Store.findByPk(store_id);

        if(!store){
            return res.status(400).json({ error: "Store informed not exists" });
        }

        const product = await Product.findByPk(product_id);

        if (!product) {
            return res.status(400).json({ error: "Product informed not exists" });
        }

        const variation = await Variation.create({
            name,
            options,
            store_id,
            product_id
        });

        return res.json(variation);
    }
};
