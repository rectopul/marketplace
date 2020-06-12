const Store = require('../models/Stores')
const Categories = require('../models/Categories')
const CategoryMap = require('../models/CategoryMap')
const UserByToken = require('../middlewares/userByToken')
const User = require('../models/User')

const { Op } = require('sequelize')
const Product = require('../models/Product')
const Image = require('../models/Image')

module.exports = {
    async index(req, res) {
        const { slug } = req.params

        if (slug) {
            //FILTROS
            const { order, orderby, paginate, page } = req.query

            const filters = [
                `title`,
                `sku`,
                `description`,
                `stock`,
                `weight`,
                `price`,
                `promotional_price`,
                `brand`,
                `model`,
            ]

            if (order && [`ASC`, `DESC`].indexOf(order) == -1)
                return res.status(400).send({ error: `The order parameter accepts the 'ASC' or 'DESC' values` })

            if (orderby && filters.indexOf(orderby) == -1)
                return res.status(400).send({ error: `orderby parameter does not exist` })

            //Get all products
            const productsCategory = await Categories.findOne({
                where: { slug },
                include: {
                    association: `products_category`,
                    include: { association: `product` },
                },
            })

            const products = await productsCategory.products_category.map((product) => {
                return product.product_id
            })

            const count = products.length

            //find all products
            const productFind = await Product.findAll({
                where: {
                    id: products,
                },
                order: order ? (orderby ? [[orderby, order]] : [['createdAt', order]]) : null,
                limit: paginate || null,
                offset: paginate * (page - 1) || null,
                include: { association: `images_product` },
            })

            //FIND
            const categories = await Categories.findOne({
                where: { slug },
                include: [
                    {
                        association: `products_category`,
                    },
                    { association: `image` },
                ],
            })

            //prepara o retorno
            const response = categories.toJSON()

            response.products_category = productFind

            if (paginate) {
                const url = `${process.env.URL}/products?paginate=${paginate}${order ? '&order=' + order : ``}${
                    orderby ? '&orderby=' + orderby : ''
                }&page=`
                const intCount =
                    count / paginate > parseInt(count / paginate)
                        ? parseInt(count / paginate) + 1
                        : parseInt(count / paginate)
                const pageInfo = {
                    total: intCount,
                    current_page: `${url}${parseInt(page)}`,
                    first_page: 1,
                    first_page_url: `${url}${1}`,
                    last_page: intCount,
                    last_page_url: `${url}${intCount}`,
                    next_page: parseInt(page) + 1 > intCount ? null : parseInt(page) + 1,
                    next_page_url: parseInt(page) + 1 > intCount ? null : `${url}${parseInt(page) + 1}`,
                    prev_page: page && page > 1 ? parseInt(page - 1) : null,
                    prev_page_url: page && page > 1 ? `${url}${parseInt(page - 1)}` : null,
                }

                response.paginate = pageInfo
            }

            return res.json(response)
        }

        const categories = await Categories.findAll({
            include: { association: `image` },
        })

        return res.json(categories)
    },

    async store(req, res) {
        /* Categories */
        try {
            const { store_id } = req.params

            const { name, description, parent, slug, characteristics, address, product_id, image_id } = req.body

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const user = await User.findByPk(user_id, {
                include: {
                    association: `stores`,
                    where: { id: store_id },
                },
            })

            if (!user) return res.status(400).send({ error: `This store does not exist for this user` })

            if (product_id) {
                //check product exist in store
                const productStore = await Store.findByPk(store_id, {
                    include: {
                        association: `products`,
                        where: { id: product_id },
                    },
                })

                if (!productStore) return res.status(400).send({ error: `This product does not exist in this store` })
            }

            //check image id exist
            if (image_id) {
                const checkimage = await Image.findByPk(image_id)

                if (!checkimage) return res.status(400).send({ error: `This image ID not exist` })
            }

            //Mapeat categoria
            const category = await Categories.create({
                name,
                description,
                parent,
                slug,
                characteristics,
                address,
                store_id,
                image_id,
            })

            if (product_id) {
                //check product exist in store
                const productStore = await Store.findByPk(store_id, {
                    include: {
                        association: `products`,
                        where: { id: product_id },
                    },
                })

                if (!productStore) return res.status(400).send({ error: `This product does not exist in this store` })

                //Check mapeation aready exist
                const productMap = await CategoryMap.findOne({ where: { product_id, category_id: category.id } })

                if (productMap) {
                    const categoryReturn = await Categories.findByPk(category.id, {
                        include: {
                            association: `products_category`,
                            where: { product_id },
                            include: {
                                association: `product`,
                            },
                        },
                    })

                    return res.json(categoryReturn)
                }

                /* Map */
                await CategoryMap.create({
                    store_id: parseInt(store_id),
                    category_id: category.id,
                    user_id,
                    product_id,
                })

                const categoryReturn = await Categories.findByPk(category.id, {
                    include: {
                        association: `products_category`,
                        where: { product_id },
                        include: {
                            association: `product`,
                        },
                    },
                })

                return res.json(categoryReturn)
            }

            return res.json(category)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            console.log(`Erro listar pedidos`, error)

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
            if ((user.type = `super`)) {
                const category = await Categories.update(
                    { name, description, parent, slug, characteristics, address },
                    {
                        where: { id: caregory_id },
                        returning: true,
                        plain: true,
                    }
                )

                if (product_id) {
                    await CategoryMap.destroy({ where: { product_id, caregory_id } })
                }

                return res.json(category)
            }

            //adm

            const category = await Categories.update(
                { name, description, parent, slug, characteristics, address },
                {
                    where: { id: caregory_id },
                    include: {
                        association: `store`,
                        where: { user_id },
                    },
                    returning: true,
                    plain: true,
                }
            )

            if (!category) return res.status(400).send({ error: `This category does not exist in your store` })

            return res.json(category)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro listar pedidos`, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },

    async delete(req, res) {
        try {
            const { caregory_id } = req.params

            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const stores = await Store.findAll({ where: { user_id } })

            if (!stores) return res.status(400).send({ error: `There are no stores registered for this user` })

            const storesId = stores.map((item) => {
                return item.id
            })

            //Remove o mapeamento
            await CategoryMap.destroy({ where: { caregory_id } })

            const category = await Categories.destroy({
                where: {
                    id: caregory_id,
                    store_id: {
                        [Op.in]: storesId,
                    },
                },
            })

            if (!category) return res.status(400).send({ error: `This category does not exist in your store` })

            return res.status(200).send()
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro listar pedidos`, error)
            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },
}
