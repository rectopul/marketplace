const ImagesBanners = require("../models/ImagesBanners");

module.exports = {
    async index(req, res) {
        const { image_id: id } = req.params
        const images = await ImagesBanners.findByPk(id)

        return res.json(images)
    },

    async delete(req, res) {
        const { image_id: id } = req.params
        const image = await ImagesBanners.findByPk(id)

        if (!image) {
            return res.status(200).json({ message: 'Image not exist ' })
        }

        const imagedel = await ImagesBanners.destroy({
            where: { id },
            individualHooks: true
        }).then((ev) => {
            return res.send()
        }).catch((err) => {
            console.log(err)
        })
    },

    async store(req, res) {
        const { image_id: id } = req.params;
        let { originalname: name, size, key, location: url = '' } = req.file

        const image = await ImagesBanners.create({
            name,
            size,
            key,
            url
        })

        return res.json(image)
    }
};
