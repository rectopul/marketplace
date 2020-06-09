const ImgProducts = require('../models/ImageProduct')

module.exports = {
    async index(req, res) {
        const { id_product: product_id } = req.params
        console.log(product_id)
        const images = await ImgProducts.findAll({ where: { product_id } })

        return res.json(images)
    },

    async delete(req, res) {
        const image = await ImgProducts.findByPk(req.params.id)

        if (!image) {
            return res.status(200).json({ message: 'Image not exist ' })
        }

        await ImgProducts.destroy({
            where: {
                id: req.params.id,
            },
            individualHooks: true,
        })
            .then(() => {
                return res.send()
            })
            .catch((err) => {
                console.log(err)
            })
    },

    async store(req, res) {
        let { originalname: name, size, key, location: url = '' } = req.file

        const image = await ImgProducts.create({
            name,
            size,
            key,
            url,
        })

        return res.json(image)
    },
}
