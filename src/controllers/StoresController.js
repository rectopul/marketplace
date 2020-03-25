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

        //Check email name
        const consultname = await Store.findOne({ where: { name } })

        if (consultname)
            return res.status(400).json({ error: "Store name already exist!" })
        //Check email exists
        const consultmail = await Store.findOne({ where: { email } })

        if (consultmail)
            return res.status(400).json({ error: "Store e-mail already exist!" })

        //Check Phone
        const consulphone = await Store.findOne({ where: { phone } })

        if (consulphone)
            return res.status(400).json({ error: "Store phone already exist!" })
        //Check cell
        const consultcell = await Store.findOne({ where: { cell } })

        if (consultcell)
            return res.status(400).json({ error: "Store cell already exist!" })
        //Check url
        const consulurl = await Store.findOne({ where: { url } })

        if (consulurl)
            return res.status(400).json({ error: "Store url already exist!" })

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
                return res.status(400).send({ error: err })

            })

    },

    async storedelete(req, res) {
        try {

            //Pegar identificação do usuário
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

            const user_id = decoded.id

            const { store_id } = req.params

            //Consulta se a loja existe
            const storeconsult = await Store.findOne({ where: { id: store_id } })

            if (!storeconsult)
                return res.status(400).send({ error: `This store does not exist` })

            //Consulta se a loja pertence ao usuário
            const storebyuser = await Store.findOne({ where: { user_id } })

            if (!storebyuser)
                return res.status(401).send({ error: `This store does not belong to this user` });

            const storedelete = await Store.destroy({ where: { id: store_id } })

            return res.status(200).send()
        } catch (error) {
            console.log('Erro ao Excluir loja: ', error)
            return res.status(401).send()
        }
    }
};
