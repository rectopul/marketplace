const Store = require("../models/Stores");
const Categories = require("../models/Categories");
const CategoryMapController = require('./CategoryMapController')

module.exports = {
    async index(req, res) {
        const { store_id } = req.params;

        const store = await Store.findByPk(store_id, {
            include: { association: "categories" }
        });

        return res.json(store);

    },

    async store(req, res) {
        /* Categories */
        const { store_id } = req.params;
        const { name, description, parent, slug, characteristics, address, user_id, product_id } = req.body;

        const store = await Store.findByPk(store_id);

        if (!store) {
            return res.status(400).json({ error: "Store informed not exists" });
        }

        /* Check slug */
        searchSlug = await Categories.findOne({ where: { slug } })

        if (searchSlug) {
            return res.status(400).json({ error: "This slug informed already exist" });
        }

        /* Check address */

        searchAddress = await Categories.findOne({ where: { address } })

        if (searchAddress) {
            return res.status(400).json({ error: "This address informed already exist" });
        }

        const category = await Categories.create({
            name,
            description,
            parent,
            slug,
            characteristics,
            address,
            store_id
        }).then(async result => {
            /* Map */
            const { id: category_id } = result
            const paramsPass = {
                store_id: parseInt(store_id),
                category_id,
                user_id,
                product_id
            }

            const processMap = await CategoryMapController.store(req.body = paramsPass).then(response => {
                console.log('Resposta: ', response);

                return res.json(result);
            }).catch(async err => {
                console.log("Erro:", err)
                const categorydel = await Categories.destroy({
                    where: {
                        id: category_id
                    },
                    individualHooks: true
                }).then((ev) => {
                    return res.send()
                }).catch((err) => {
                    console.log(err)
                })
            })
        }).catch(err => {
            console.log('Erro: ', err)
        })


    }
};
