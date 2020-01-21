const User = require("../models/User");
const Store = require("../models/Stores");

module.exports = {
    async index(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, {
            include: { association: "stores" }
        });

        return res.json(user);
    },

    async store(req, res) {
        const { user_id } = req.params;
        const { name, email, phone, cell, url, zipcode, state, city, street, number } = req.body;

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
        });
        return res.json(stores);
    }
};
