const User = require("../models/User");

module.exports = {
    async index(req, res) {
        const users = await User.findAll();

        return res.json(users);
    },

    async store(req, res) {
        const {
            client_id,
            name,
            email,
            password,
            auth,
            credentials
        } = req.body;

        const user = await User.create({
            client_id,
            name,
            email,
            password,
            auth,
            credentials
        });

        return res.json(user);
    }
};
