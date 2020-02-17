const Client = require('../models/Client');
const Store = require('../models/Stores')
const Order = require('../models/Order')
const ProdutctOrder = require('../models/ProductOrder')
const Product = require('../models/Product')
const ClientMiddleware = require('../middlewares/ClientMiddleware')
const DeliveryAddress = require('../models/DeliveryAddress')

const jwt = require('jsonwebtoken')
const { promisify } = require("util");

module.exports = {
    async index(req, res) {
    },

    async store(req, res) {
        const { store_id } = req.params;

        var { products } = req.body;

        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).send({ error: "No token provided" });

        const [, token] = authHeader.split(" ");

        const store = await Store.findByPk(store_id)

        if (!store) {
            return res.status(401).send({ error: "This store not exist" })
        }

        const client_id = await ClientMiddleware(token, store_id)
            .then(async c_id => {
                const order = await Order.create({
                    store_id: store_id,
                    client_id: c_id
                })
                    .then(async re => {

                        var products_object = []
                        for (const i in products) {
                            if (products.hasOwnProperty(i)) {
                                const product = products[i];
                                const productorder = {
                                    product_id: product.id,
                                    store_id,
                                    client_id: c_id,
                                    order_id: re.id,
                                    quantity: product.quantity,
                                    variation_id: product.variation_id
                                }

                                products_object.push(productorder)

                            }
                        }

                        var orderproducts = await ProdutctOrder.bulkCreate(products_object)
                            .then(async pr => {


                                /* Consulta pedido */
                                const GetProducts = await ProdutctOrder.findAll({ where: { order_id: re.id } })

                                const ListProducts = GetProducts.map(function (e) { return e.product_id; })

                                const InfosClient = await Client.findByPk(c_id)

                                const product = await Product.findAll({ where: { id: ListProducts } })

                                const delivery = await DeliveryAddress.findOne({ where: { client_id: c_id, active: "yes" } })

                                let ObjectOrder = InfosClient.toJSON()

                                const productQuantity = product.map(function (prod) {
                                    prod = prod.toJSON()
                                    for (const i in GetProducts) {
                                        if (GetProducts.hasOwnProperty(i)) {
                                            const productId = GetProducts[i];
                                            if (prod.id === productId.product_id) {
                                                if (!productId.quantity) {
                                                    prod['quantidade'] = 1
                                                } else {
                                                    prod['quantidade'] = productId.quantity
                                                }
                                                return prod
                                            }
                                        }
                                    }

                                })

                                if (delivery) {
                                    ObjectOrder['delivery_address'] = delivery
                                } else {
                                    ObjectOrder['delivery_address'] = null
                                }

                                ObjectOrder.products = productQuantity

                                return res.json(ObjectOrder)
                            })
                            .catch(async pe => {
                                console.log('Error Insert Product Order: ', pe);
                                const delorder = await Order.destroy({
                                    where: { id: re.id },
                                    individualHooks: true
                                })
                                    .then(ress => {
                                        return res.status(401).send({ error: 'Problemas ao cadastrar produtos' })
                                    })
                            })
                    })
                    .catch(err => {
                        console.log('Erro Insert Order: ', err);
                    })
            })
            .catch(e => {
                return res.status(401).send({ error: 'erro' })
            })
    },
};
