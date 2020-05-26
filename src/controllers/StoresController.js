/* eslint-disable no-undef */
const User = require('../models/User')
const Store = require('../models/Stores')
const jwt = require('jsonwebtoken')
const UserByToken = require('../middlewares/userByToken')
const { createAccount, checkAccount, consultAccount, getPublicKey } = require('../modules/payment')

module.exports = {
    async index(req, res) {
        const authHeader = req.headers.authorization

        if (!authHeader) return res.status(401).send({ error: 'No token provided 3' })

        const [, token] = authHeader.split(' ')

        var decoded

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            return res.status(401).send({ error: 'unauthorized' })
        }

        const user_id = decoded.id

        const user = await User.findByPk(user_id, {
            include: { association: 'stores' },
        })

        return res.json(user)
    },

    async store(req, res) {
        try {
            const {
                nameStore,
                password,
                name,
                lastName,
                email,
                cpf,
                rg,
                issuer,
                issueDate,
                birthDate,
                phone,
                cell,
                countryCode,
                url,
                street,
                district,
                zipcode,
                state,
                city,
                country,
                number,
                wirecardId,
            } = req.body

            const account = await checkAccount(cpf)

            //check user already exist use cpf
            const cpfcheck = await User.findOne({ where: { cpf } })

            if (cpfcheck) return res.status(400).send({ error: `There is already a user with this cpf` })

            //check user already exist use email
            const mailcheck = await User.findOne({ where: { email } })

            if (mailcheck) return res.status(400).send({ error: `There is already a user with this email` })

            if (account.status == 400) return res.status(400).send({ error: `cpf invalid` })

            if (account.status == 404) {
                // eslint-disable-next-line no-unused-vars
                const createWireAccount = await createAccount({
                    name,
                    lastName,
                    email,
                    cpf,
                    rg,
                    issuer,
                    issueDate,
                    birthDate,
                    phone,
                    countryCode,
                    street,
                    streetNumber: number,
                    district,
                    zipCode: zipcode,
                    city,
                    state,
                    country,
                })

                const user = await User.create({
                    name: `${name} ${lastName}`,
                    email,
                    type: `storeAdministrator`,
                    password,
                    phone,
                    cell,
                })

                const user_id = user.id

                const token = user.generateToken()

                const pKey = await getPublicKey(createWireAccount.accessToken)

                const store = await Store.create({
                    nameStore,
                    name,
                    lastName,
                    email,
                    cpf,
                    rg,
                    issuer,
                    issueDate,
                    birthDate,
                    phone,
                    cell,
                    countryCode,
                    url,
                    street,
                    district,
                    zipcode,
                    state,
                    city,
                    country,
                    number,
                    wirecardId: createWireAccount.id,
                    acess_token: createWireAccount.accessToken,
                    public_key: JSON.parse(pKey).keys.encryption,
                    user_id,
                })

                const resume = store.toJSON()

                resume.user = {
                    name: `${name} ${lastName}`,
                    email,
                    token,
                }
                return res.json(resume)
            } else {
                if (!wirecardId)
                    return res
                        .status(400)
                        .send({ error: `This cpf already has a wirecard account, please provide the account id` })

                await consultAccount(wirecardId)

                const user = await User.create({
                    name: `${name} ${lastName}`,
                    email,
                    type: `storeAdministrator`,
                    password,
                    phone,
                    cell,
                })

                const user_id = user.id

                const token = user.generateToken()

                const store = await Store.create({
                    nameStore,
                    name,
                    lastName,
                    email,
                    cpf,
                    rg,
                    issuer,
                    issueDate,
                    birthDate,
                    phone,
                    countryCode,
                    url,
                    street,
                    district,
                    zipcode,
                    state,
                    city,
                    country,
                    number,
                    wirecardId,
                    user_id,
                })

                const resume = store.toJSON()

                resume.user = {
                    name: `${name} ${lastName}`,
                    email,
                    token,
                }
                return res.json(resume)
            }
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `wireOrderError` ||
                error.name == `bestSubmissionError` ||
                error.name == `StatusCodeError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar nova loja: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async storeUpdate(req, res) {
        try {
            const { store_id } = req.params

            //delete fields not updated
            if (req.body.user_id) return res.status(400).send({ error: `Cannot change store owner` })

            //Pegar id do usuário a partir do token
            const authHeader = req.headers.authorization
            const [, token] = authHeader.split(' ')

            let decoded = jwt.verify(token, process.env.APP_SECRET)

            const user_id = decoded.id

            const store = await Store.findOne({ where: { id: store_id, user_id } })

            if (!store) return res.status(400).send({ error: `This store does not belong to this user` })

            let updateValues = {}
            await Object.keys(req.body).map((item) => {
                if (req.body[item] != undefined && item != `id`) return (updateValues[item] = req.body[item])
            })

            const storeupdate = await Store.update(updateValues, {
                where: { id: store_id },
                returning: true,
                plain: true,
            })

            return res.status(200).send(storeupdate[1])
        } catch (error) {
            console.log(`Erro ao Atualizar Produto`, error)
            return res.status(400).send({ error })
        }
    },

    async delete(req, res) {
        try {
            const { store_id } = req.params
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const user = await User.findByPk(user_id)

            //check store exist
            const ext = await Store.findByPk(store_id)

            if (!ext) return res.status(400).send({ error: `This store do not exist` })

            //super
            if (user.type == `super`) {
                await Store.destroy({ where: { id: store_id } })

                return res.status(200).send()
            }

            //check
            const store = await Store.findOne({ where: { user_id, id: store_id } })

            if (!store) return res.status(400).send({ error: `This store does not belong to this user` })

            await Store.destroy({ where: { id: store_id } })
            return res.status(200).send()
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            console.log(`Erro ao excluir loja: `, error)

            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            return res.status(500).send({ error: error })
        }
    },
}
