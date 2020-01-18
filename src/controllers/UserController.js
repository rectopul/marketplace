<<<<<<< HEAD
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
=======
const User = require('../models/User');

module.exports = {
	async index(req, res) {
		const users = await User.findAll();

		return res.json(users);
	},

	async store(req, res) {
		const { name, email, password, type } = req.body;

		const user = await User.create({
			name,
			email,
			password,
			type,
		});

		return res.json(user);
	},
};
>>>>>>> cca3b28560c3e2d78053e2667f0c9560bfd5a64b
