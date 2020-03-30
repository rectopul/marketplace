const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { promisify } = require("util");
const crypto = require('crypto')
const mailer = require('../modules/mailer')
const UserByToken = require('../middlewares/userByToken')
const Store = require('../models/Stores')

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
        try {

            //Get user id by token
            const authHeader = req.headers.authorization;

            const { name, email, password, type, store_id } = req.body

            const { user_id } = await UserByToken(authHeader)

            const superUser = await User.findByPk(user_id)

            const userMail = await User.findOne({ where: { email } })

            if (userMail)
                return res.status(401).json({ message: 'the email you entered is already registered' })

            if (superUser.type != `super` && type == `super`)
                return res.status(401).json({ message: 'You are not allowed to register this type of user' })

            //Caso não for um super consulta a loja se pertence ao usuário
            if (store_id) {
                const store = await Store.findByPk(store_id)

                if (!store)
                    return res.status(401).json({ message: 'This store not exist' })

                if (store.user_id != user_id)
                    return res.status(401).json({ message: 'This store does not belong to this user' })
            }

            const user = await User.create({
                name,
                email,
                password,
                type,
                store_id
            });

            return res.json(user);

        } catch (error) {
            return res.status(400).send({ error: error })
        }
    },

    async forgot(req, res) {
        const { email } = req.body

        try {
            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(401).json({ message: 'the email you entered not exists' })
            }

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()


            now.setHours(now.getHours() + 1)

            await user.update({
                passwordResetToken: token,
                passwordResetExpires: now
            }, { where: { email } })

            mailer.sendMail({
                to: email,
                from: process.env.MAIL_FROM,
                template: 'auth/forgot_password',
                context: { token }
            }, (err) => {

                if (err)
                    return res.status(400).send({ error: 'Cannot send forgot password email' })

                return res.send()
            })

        } catch (error) {
            console.log(error);
            res.status(400).send({ error: 'Erro on forgot password, try again' })
        }
    },

    async reset(req, res) {
        const { email, password, token } = req.body

        try {
            const user = await User.findOne({ where: { email } })

            if (!user)
                return res.status(400).json({ Error: 'the email you entered not exists' })

            if (token !== user.passwordResetToken)
                return res.status(400).json({ Error: 'Token invalid' })

            const now = new Date()

            if (now > user.passwordResetExpires)
                return res.status(400).json({ Error: 'Token Expired, generate a new one' })

            user.password = password

            await user.update({ user })

            return res.json({ message: 'success!' })

        } catch (error) {
            res.status(400).send({ error: 'Erro on reset password, try again' })
        }
    }
};
