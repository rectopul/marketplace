const User = require("../models/User");
const Address = require("../models/Address");
const jwt = require("jsonwebtoken");

module.exports = {
    async index(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, {
            include: { association: "addresses" }
        });

        return res.json(user);
    },

    async store(req, res) {
        const { zipcode, state, city, street, number } = req.body;

        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).send({ error: "No token provided 1" });

        const [, token] = authHeader.split(" ");

        var decoded

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
            console.log(decoded);
        } catch (e) {
            return res.status(401).send({ error: 'unauthorized' });
        }

        var user_id = decoded.id;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const address = await Address.create({
            zipcode,
            state,
            city,
            street,
            number,
            user_id
        });

        return res.json(address);
    }
};
