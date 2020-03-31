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
        const { store_id } = req.params

        const { products, cart_id } = req.body


    },
};
