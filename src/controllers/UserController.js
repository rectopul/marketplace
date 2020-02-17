const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { promisify } = require("util");

module.exports = {
    async index(req, res) {
        const users = await User.findAll();
        return res.json(users);
    },

    async single(req, res) {
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

        var id = decoded.id;
        const userToken = await User.findByPk(id, {
            include: { association: "addresses" }
        })

        if (!userToken) {
            return res.status(401).json({ message: 'User from token not found' })
        }

        return res.json(userToken);
    },

    async store(req, res) {
        const { name, email, password, type } = req.body

        const userMail = await User.findOne({ where: { email } })

        if (userMail) {
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
