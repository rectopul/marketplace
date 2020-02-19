const User = require("../models/User");
const Store = require("../models/Stores");
const jwt = require("jsonwebtoken");

module.exports = {
    async index(req, res) {
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

        const user_id = decoded.id;

        const user = await User.findByPk(user_id, {
            include: { association: "stores" }
        });

        return res.json(user);
    },

    async store(req, res) {
        const { name, email, phone, cell, url, zipcode, state, city, street, number } = req.body;

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

        const user_id = decoded.id;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const stores = await Store.create({
            name,
            email,
            phone,
            cell,
            url,
            zipcode,
            state,
            city,
            street,
            number,
            user_id
        })
            .then(result => {
                return res.json(result);
            })
            .catch(err => {
                console.log(err);

            })

    }
};
