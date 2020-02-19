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

        const { products } = req.body;

        const authHeader = req.headers.authorization;

        const status = 'pendente'

        /* Check product in shop */

        const Productsinorder = products.map(function (e) { return e.id; })

        const checkproduct = Productsinorder.map(async (pid) => {
            const consultProd = await Product.findAll({ where: { id: pid, store_id } })

            if (!consultProd) {
                return res.status(401).send({ error: "Product not present in store!" });
            }
        })

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
                    store_id,
                    client_id: c_id,
                    status
                })
                    .then(async re => {

                        var products_object = []
                        const listObjectProducts = products.map((mapProd) => {
                            const productorder = {
                                product_id: mapProd.id,
                                store_id,
                                client_id: c_id,
                                order_id: re.id,
                                quantity: mapProd.quantity,
                                variation_id: mapProd.variation_id,
                            }
                            products_object.push(productorder)
                        })

                        var orderproducts = await ProdutctOrder.bulkCreate(products_object)
                            .then(async pr => {


                                /* Consulta pedido */
                                const GetProducts = await ProdutctOrder.findAll({ where: { order_id: re.id } })

                                const ListProducts = GetProducts.map(function (e) { return e.product_id; })

                                const InfosClient = await Client.findByPk(c_id)

                                const product = await Product.findAll({ where: { id: ListProducts } })

                                const delivery = await DeliveryAddress.findOne({ where: { client_id: c_id, active: "yes" } })

                                let ObjectOrder = InfosClient.toJSON()

                                const productQuantity = product.map((prod) => {
                                    prod = prod.toJSON()
                                    const nprod = GetProducts.map((itm) => { prod.id === itm.product_id ? !itm.quantity ? prod['quantidade'] = 1 : prod['quantidade'] = itm.quantity : '' })
                                    return prod
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
