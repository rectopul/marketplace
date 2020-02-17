const Store = require("../models/Stores");
const Client = require('../models/Client')
const DeliveryAddress = require("../models/DeliveryAddress");
const ClientMiddleware = require('../middlewares/ClientMiddleware')

module.exports = {
    async index(req, res) {
        const { store_id } = req.params
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).send({ error: "No token provided" });

        const [, token] = authHeader.split(" ");

        const client_id = await ClientMiddleware(token, store_id)

        const client = await Client.findByPk(client_id, {
            include: { association: "delivery" }
        });

        return res.json(client);
    },

    async store(req, res) {
        const { store_id } = req.params;

        const { name, cpf, zipcode, city, address, state, active } = req.body;

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
                const delivery = await DeliveryAddress.create({
                    name,
                    cpf,
                    address,
                    zipcode,
                    city,
                    state,
                    active,
                    store_id: store_id,
                    client_id: c_id
                })
                    .then(re => {
                        return res.json(re);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(e => {
                return res.status(401).send({ error: 'erro' })
            })
    }
};
