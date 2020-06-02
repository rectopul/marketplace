const Image = require('../models/Image')
const ImgProducts = require('../models/ImageProduct')

module.exports = {
    async index(req, res) {
        const images = await Image.findAll()

        return res.json(images)
    },

    async delete(req, res) {
        const image = await Image.findByPk(req.params.id)

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

        const image = await Image.create({
            name,
            size,
            key,
            url,
        })

        return res.json(image)
    },
}
