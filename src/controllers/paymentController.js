const userByToken = require('../middlewares/userByToken')
const Order = require('../models/Order')
const { createPayment } = require('../modules/payment')
const ClientCard = require('../models/ClientCard')

module.exports = {
    async orderPayment(req, res) {
        try {
            //get method payment
            const { method } = req.params

            const authHeader = req.headers.authorization

            const { client_id } = await userByToken(authHeader)

            //check order
            const { order } = req.body

            //consult order
            const orderPay = await Order.findOne({ where: { id: order, client_id }, include: { association: `store` } })

            if (!orderPay) return res.status(400).send({ error: `This order not exist` })
            //credit card
            if (method == `CREDIT_CARD`) {
                //get order
                const {
                    installmentCount,
                    hash,
                    store,
                    fullname,
                    birthdate,
                    phone,
                    cpf,
                    countryCode,
                    street,
                    streetNumber,
                    complement,
                    district,
                    city,
                    state,
                    country,
                    zipCode,
                } = req.body

                if (!hash) return res.status(400).send({ error: `Enter the card hash code` })

                const pay = await createPayment(method, orderPay.order, {
                    installmentCount,
                    statementDescriptor: orderPay.store.nameStore,
                    hash,
                    store,
                    fullname,
                    birthdate,
                    phone,
                    cpf,
                    countryCode,
                    street,
                    streetNumber,
                    complement,
                    district,
                    city,
                    state,
                    country,
                    zipCode,
                })

                //Check se irá salvar os dados do cartão
                if (state) {
                    const { brand, first6, last4 } = pay.fundingInstrument.creditCard
                    await ClientCard.create({
                        client_id,
                        brand,
                        first: first6,
                        last: last4,
                        hash,
                        card_id: pay.fundingInstrument.creditCard.id,
                    })
                }

                await Order.update({ status: pay.status }, { where: { id: orderPay.id } })

                const orderSend = await Order.findByPk(orderPay.id)

                return res.json({
                    order: orderSend,
                    payment: pay,
                })
            }
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `wireOrderError` ||
                error.name == `bestSubmissionError` ||
                error.name == `weCheckoutError`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao realizar pagamento: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
