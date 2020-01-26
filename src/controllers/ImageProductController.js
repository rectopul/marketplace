const ImgProducts = require("../models/ImageProduct");
const Product = require('../models/Product')

module.exports = {
    async index(req, res) {
        const { id_product: product_id } = req.params
        console.log(product_id)
        const images = await ImgProducts.findAll({ where: { product_id }})
        
        return res.json(images)
    },

    async delete(req, res){
        const image = await ImgProducts.findByPk(req.params.id)

        if(!image){
            return res.status(200).json({ message: 'Image not exist '} )
        }

        const imagedel = await ImgProducts.destroy({
            where: {
                id: req.params.id
            },
            individualHooks: true
        }).then((ev) => {
            return res.send()
        }).catch((err) => {
            console.log(err)
        })
    },

    async store(req, res) {
        const { id_product: product_id } = req.params;
        let { originalname: name, size, key, location: url = '' } = req.file
        const product = await Product.findByPk( product_id )

        if(!product){
            res.status(400).json({ error: 'Product not found '} )
        }

        const image = await ImgProducts.create({
            name,
            size,
            key,
            url,
            product_id
        })

        return res.json(image)
    }
};
