const Banners = require("../models/Banners");
const Stores = require("../models/Stores");
const User = require('../models/User')
const ImagesBanners = require('../models/ImagesBanners')
const StoreRelation = require('../middlewares/StoreRelationship')
const jwt = require('jsonwebtoken')

module.exports = {
    async index(req, res) {
        const { store_id } = req.params

        const store = await Stores.findByPk(store_id, {
            include: { association: "banners" }
        })

        return res.json(store);
    },

    async location(req, res) {
        const { location: position, store_id } = req.params

        const banner = await Banners.findAll({ where: { store_id, position } })

        const images = banner.map(async item => {
            let { id, title, description, position, image_id } = item

            try {

                let image_url = await ImagesBanners.findByPk(image_id)

                let item_image = {
                    id,
                    title,
                    description,
                    position,
                    image_url: image_url.url
                }

                return item_image
            } catch (error) {
                if (error)
                    console.log('Erro Baner: ', error);

            }
        })

        const resultado = await Promise.all(images);

        console.log(resultado);
        return res.json(resultado);
    },

    async delete(req, res) {
        const { banner_id: id } = req.params

        try {
            await StoreRelation(req)
            const select = await Banners.findByPk(id)

            if (!select) {
                return res.status(401).json({ error: "The selected banner does not exist" })
            } else {
                const image = await ImagesBanners.destroy({ where: { id: select.image_id } })
            }
            /** Remove Image */

            const banner = await Banners.destroy({ where: { id }, individualHooks: true })

            return res.send()
        } catch (error) {
            console.log('Erro Remove: ', error);

            if (error) {
                return res.status(401).json({ error: "Error in remove banner" })
            }
        }
    },

    async update(req, res) {
        await StoreRelation(req)

        const { title, description, position, image_id } = req.body;
        const { banner_id: id } = req.params

        try {

            /** Check if banner exists  */
            const select = await Banners.findByPk(id)

            if (!select)
                return res.status(400).json({ error: "The selected banner does not exist" })

            const banner = await Banners.update({ title, description, position, image_id }, { where: { id }, returning: true, plain: true })

            return res.json(banner[1])

        } catch (error) {
            return res.status(400).json({ error: "Error in Update banner" })
        }
    },

    async store(req, res) {
        const { title, description, position, image_id } = req.body;
        const { store_id } = req.params

        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).send({ error: "No token provided" });

        const [, token] = authHeader.split(" ");

        var decoded

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            return res.status(401).send({ error: 'unauthorized' });
        }

        var user_id = decoded.id;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const store = Stores.findOne({ where: { user_id } })

        if (!store)
            return res.status(400).json({ error: "User does not belong to informed store" });

        const banner = await Banners.create({ title, description, position, image_id, store_id });

        return res.json(banner);
    }
};
