const Store = require("../models/Stores");
const Categories = require("../models/Categories");
const CategoryMap = require('../models/CategoryMap')
const UserByToken = require('../middlewares/userByToken')
const User = require('../models/User')

const { Op } = require('sequelize')

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
        try {
            const { store_id } = req.params;

            const { name, description, parent, slug, characteristics, address, product_id } = req.body;

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const user = await User.findByPk(user_id, {
                include: {
                    association: `stores`,
                    where: { id: store_id }
                }
            })

            if (!user)
                return res.status(400).send({ error: `This store does not exist for this user` })

            if (product_id) {
                //check product exist in store
                const productStore = await Store.findByPk(store_id, {
                    include: {
                        association: `products`,
                        where: { id: product_id }
                    }
                })

                if (!productStore)
                    return res.status(400).send({ error: `This product does not exist in this store` })
            }

            //Mapeat categoria
            const category = await Categories.create({
                name,
                description,
                parent,
                slug,
                characteristics,
                address,
                store_id
            })

            if (product_id) {
                //check product exist in store
                const productStore = await Store.findByPk(store_id, {
                    include: {
                        association: `products`,
                        where: { id: product_id }
                    }
                })

                if (!productStore)
                    return res.status(400).send({ error: `This product does not exist in this store` })

                //Check mapeation aready exist
                const productMap = await CategoryMap.findOne({ where: { product_id, category_id: category.id } })

                if (productMap) {
                    const categoryReturn = await Categories.findByPk(category.id, {
                        include: {
                            association: `products_category`,
                            where: { product_id },
                            include: {
                                association: `product`
                            }
                        }
                    })

                    return res.json(categoryReturn)
                }

                /* Map */
                const categoryMap = await CategoryMap.create({
                    store_id: parseInt(store_id),
                    category_id: category.id,
                    user_id,
                    product_id
                })

                const categoryReturn = await Categories.findByPk(category.id, {
                    include: {
                        association: `products_category`,
                        where: { product_id },
                        include: {
                            association: `product`
                        }
                    }
                })

                return res.json(categoryReturn)


            }

            return res.json(category)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro listar pedidos`, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: error })
        }
    },

    async update(req, res) {
        try {
            //bodyes
            const { name, description, parent, slug, characteristics, address } = req.body

            //params
            const { caregory_id, product_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const user = await User.findByPk(user_id)

            //super
            if (user.type = `super`) {
                const category = await Categories.update({ name, description, parent, slug, characteristics, address }, {
                    where: { id: caregory_id },
                    returning: true,
                    plain: true
                })

                if (product_id) {
                    const unmap = await CategoryMap.destroy({ where: { product_id, caregory_id } })
                }

                return res.json(category)
            }

            //adm

            const category = await Categories.update({ name, description, parent, slug, characteristics, address }, {
                where: { id: caregory_id },
                include: {
                    association: `store`,
                    where: { user_id }
                },
                returning: true,
                plain: true
            })

            if (!category)
                return res.status(400).send({ error: `This category does not exist in your store` })

            return res.json(category)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro listar pedidos`, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: error })
        }
    },

    async delete(req, res) {
        try {
            const { caregory_id, product_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const stores = await Store.findAll({ where: { user_id } })

            if (!stores)
                return res.status(400).send({ error: `There are no stores registered for this user` })

            const storesId = stores.map(item => {
                return item.id
            })

            //adm
            if (product_id) {

                //Check is product exist in store
                const checkproduct = await CategoryMap.findOne({
                    where: {
                        product_id,
                        store_id: {
                            [Op.in]: storesId
                        }
                    }
                })

                if (!checkproduct)
                    return res.status(400).send({ error: `This product does not belong to your store` })

                const unmap = await CategoryMap.destroy({ where: { product_id, caregory_id } })

                if (!unmap)
                    return res.status(400).send({ error: `This category does not exist in your store` })

                return res.status(200).send()
            }

            const category = await Categories.destroy({
                where: {
                    id: caregory_id,
                    store_id: {
                        [Op.in]: storesId
                    }
                }
            })

            if (!category)
                return res.status(400).send({ error: `This category does not exist in your store` })

            return res.status(200).send()

        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`)
                return res.status(400).send({ error })

            console.log(`Erro listar pedidos`, error);
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })


            return res.status(500).send({ error: error })
        }
    }
};
