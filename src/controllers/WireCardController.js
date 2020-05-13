const Client = require('../models/Client')
const userByToken = require('../middlewares/userByToken')
const { createClient } = require('../modules/payment')

module.exports = {
    async createClient(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { client_id } = await userByToken(authHeader)

            const client = await Client.findByPk(client_id)

            //Validação
            const { wireId, email, name, surname } = client
            const {
                birthDate,
                cpf,
                countryCode,
                phoneNumber,
                street,
                streetNumber,
                complement,
                district,
                city,
                state,
                country,
                zipCode,
            } = req.body

            //Check se já existe conta de pagamento
            if (wireId) return res.status(400).send({ error: `This customer already has a payment account` })

            //Check se já existe conta de pagamento
            if (!streetNumber)
                return res.status(400).send({ error: `Please enter the streetNumber in the format "00"` })
            //Check se já existe conta de pagamento
            if (!birthDate)
                return res.status(400).send({ error: `Please enter the birthDate in the format "YYYY-MM-DD"` })
            //Check se já existe conta de pagamento
            if (!cpf) return res.status(400).send({ error: `Please enter the cpf in the format "99999999999"` })
            //Check se já existe conta de pagamento
            if (!countryCode) return res.status(400).send({ error: `Please enter the countryCode in the format "55"` })
            //Check se já existe conta de pagamento
            if (!phoneNumber)
                return res.status(400).send({ error: `Please enter the countryCode in the format "(99) 9999-9999"` })
            //Check se já existe conta de pagamento
            if (!street) return res.status(400).send({ error: `Please inform the street` })
            //Check se já existe conta de pagamento
            if (!district) return res.status(400).send({ error: `Please inform the district` })
            //Check se já existe conta de pagamento
            if (!city) return res.status(400).send({ error: `Please inform the city` })
            //Check se já existe conta de pagamento
            if (!state) return res.status(400).send({ error: `Please inform the state` })
            //Check se já existe conta de pagamento
            if (!country) return res.status(400).send({ error: `Please inform the country` })
            //Check se já existe conta de pagamento
            if (!zipCode)
                return res.status(400).send({ error: `Please enter the countryCode in the format "99999999"` })

            const wirecard = await createClient({
                ownId: `WEC-${client.id}`,
                fullname: `${name} ${surname}`,
                email,
                birthDate,
                cpf,
                countryCode,
                areaCode: phoneNumber.substr(1, 2),
                phoneNumber: phoneNumber.substr(5, 15),
                street,
                streetNumber,
                complement,
                district,
                city,
                state,
                country,
                zipCode,
            })

            await Client.update(
                {
                    wireId: wirecard.id,
                    ownId: wirecard.ownId,
                    birthDate,
                    cpf,
                    countryCode,
                    phoneNumber,
                    street,
                    streetNumber,
                    complement,
                    district,
                    city,
                    state,
                    country,
                    zipCode,
                },
                { where: { id: client_id } }
            )

            const resume = await Client.findByPk(client_id, {
                attributes: { exclude: [`password_reset_token`, `password_reset_expires`, `password_hash`] },
            })

            return res.json(resume)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo cliente: `, error.message)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
