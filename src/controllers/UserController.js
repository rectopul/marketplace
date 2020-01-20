const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { promisify } = require("util");

module.exports = {
	async index(req, res) {
		const users = await User.findAll();

		return res.json(users);
	},

	async store(req, res) {
        const { name, email, password, type } = req.body

        const userMail = await User.findOne({ where: { email } })

        if(userMail){
            return res.status(401).json({ message: 'the email you entered is already registered' })
        }
        
        const user = await User.create({
            name,
            email,
            password,
            type,
        });

        return res.json(user);
	},
};
