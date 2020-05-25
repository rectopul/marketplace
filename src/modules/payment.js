/* eslint-disable no-unused-vars */
const validate = require('./validator')
const accessToken = `8597790d032a4146b4832f49f6ff477d_v2`
var request = require('request')
const token = `OJTJZAMDPYN8VG4W8QVNM9TV4E33D8WA`
const chave = `XN653LFP0Y5ZCGPMA2S3ZPQRKGPINCFGCJUPIR6X`
const secWonId = `MPA-7900077268CA`
const logoUri = `https://via.placeholder.com/200x90.png?text=Wechchout`
const statementDescriptor = `Wecheckout - Marketplace`
const appId = `APP-ZUEJ4DILMQHB`
const uriApp = process.env.URLAPP
const redirectUri = `http://localhost:3333/moip`
const chavePublica = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlDd2mDvwvPM7L6kyZrVT
c+VNiXua82Ua/WQqSjz5IUPr8rwfiQLYR6xFDv6i4L4m19GqjbE9ctlVyws4fhVN
PzrI9Cz845ZzTFjhyzD6qdMpi1bd+O4CEOW8k/YDqFO42E7Ggfc0Ira2XH43yZFn
sUSMehjEN0IjdTeZhDqvRKSXcGiWRvbUgogO4QwuvN28qao4oUhnUt2hMEGrloX4
5yiVihGNZMMKrtx/b20762cbk+Qfk5i2JtuGx65ORenE69e0QJDr3gk8kKS6YnAJ
xJMqIXQ7LnIlFobQ34JWS/2nc6czJsS7wiTFv7VYg1JHT6DSgAn12w22QvUqwH6M
UQIDAQAB
-----END PUBLIC KEY-----`

const moip = require('moip-sdk-node').default({
    accessToken,
    production: false,
})

const axios = require('axios')

module.exports = {
    async redirectUri(req, res) {
        res.json(req.query)
    },
    getPublicKey(token) {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                url: 'https://sandbox.moip.com.br/v2/keys',
                headers: { authorization: `OAuth ${token}` },
            }
            request(options, function (error, response, body) {
                if (error) return reject({ name: `weCheckoutError`, message: error.message })

                return resolve(response.body)
            })
        })
    },
    async cancelPayment(paymentId) {
        return new Promise((resolve, reject) => {
            moip.payment
                .preAuthorizationCancel(paymentId)
                .then((response) => {
                    return resolve(response)
                })
                .catch((err) => {
                    return reject({ name: `weCheckoutError`, message: err.message })
                })
        })
    },
    async createPayment(method, order, paymentinfos) {
        return new Promise((resolve, reject) => {
            let params = {}
            if (method == `CREDIT_CARD`) {
                const {
                    installmentCount,
                    statementDescriptor,
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
                } = paymentinfos

                params = {
                    installmentCount,
                    statementDescriptor: statementDescriptor.substr(0, 12),
                    fundingInstrument: {
                        method: method,
                        creditCard: {
                            hash,
                            store,
                            holder: {
                                fullname,
                                birthdate,
                                taxDocument: {
                                    type: 'CPF',
                                    number: cpf,
                                },
                                phone: {
                                    countryCode,
                                    areaCode: phone.substr(1, 2),
                                    number: phone.replace('-', '').substr(5, 15),
                                },
                                billingAddress: {
                                    street,
                                    streetNumber,
                                    complement,
                                    district,
                                    city,
                                    state,
                                    country,
                                    zipCode,
                                },
                            },
                        },
                    },
                }

                console.log(`Dados do cartao`, order)
            } else if (method == `BOLETO`) {
                const now = new Date()

                now.setDate(now.getDate() + 10)
                now.setMonth(now.getMonth() + 1)

                params = {
                    statementDescriptor: statementDescriptor.substr(0, 12),
                    fundingInstrument: {
                        method,
                        boleto: {
                            expirationDate: `${now.getFullYear()}-${
                                now.getMonth() < 10 ? '0' + now.getMonth() : now.getMonth()
                            }-${now.getDate()}`,
                            instructionLines: {
                                first: `Atenção,`,
                                second: `fique atento à data de vencimento do boleto.`,
                                third: `Pague em qualquer casa lotérica.`,
                            },
                            logoUri,
                        },
                    },
                }
            } else if (method == `DEBIT`) {
                const now = new Date()

                now.setDate(now.getDate() + 10)
                now.setMonth(now.getMonth() + 1)

                params = {
                    fundingInstrument: {
                        method: 'ONLINE_BANK_DEBIT',
                        onlineBankDebit: {
                            bankNumber: '341',
                            expirationDate: `${now.getFullYear()}-${
                                now.getMonth() < 10 ? '0' + now.getMonth() : now.getMonth()
                            }-${now.getDate()}`,
                            returnUri: uriApp,
                        },
                    },
                }
            }

            moip.payment
                .create(order, params)
                .then((response) => {
                    return resolve(response.body)
                })
                .catch((err) => {
                    return reject({ name: `weCheckoutError`, message: err.message })
                })
        })
    },
    getOrder(orderId) {
        return new Promise((resolve, reject) => {
            moip.order
                .getOne(orderId)
                .then((response) => {
                    return resolve(response.body)
                })
                .catch((err) => {
                    return reject(err)
                })
        })
    },
    async createOrder(receivers) {
        return new Promise((resolve, reject) => {
            const {
                orderID,
                customerId,
                own_id,
                shipping,
                productTitle,
                quantity,
                detail,
                productPrice,
                moipId,
            } = receivers

            const percent = 7

            moip.order
                .create({
                    ownId: moipId,
                    amount: {
                        currency: 'BRL',
                        subtotals: {
                            shipping,
                        },
                    },
                    items: [
                        {
                            product: productTitle,
                            quantity,
                            detail,
                            price: productPrice,
                        },
                    ],
                    receivers: [
                        {
                            moipAccount: {
                                id: moipId,
                            },
                            type: 'PRIMARY',
                            amount: {
                                percentual: 100 - percent,
                            },
                            feePayor: true,
                        },
                        {
                            moipAccount: {
                                id: secWonId,
                            },
                            type: 'SECONDARY',
                            amount: {
                                percentual: percent,
                            },
                            feePayor: false,
                        },
                    ],
                    customer: {
                        id: customerId,
                        ownId: own_id,
                    },
                })
                .then((response) => {
                    return resolve(response.body)
                })
                .catch((err) => {
                    return reject({
                        name: `wireOrderError`,
                        message: err.message,
                    })
                })
        })
    },
    async listClients(cusID) {
        return new Promise((resolve, reject) => {
            moip.customer
                .getAll()
                .then((response) => {
                    resolve(response.body)
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
    },
    async getClient(cusID) {
        return new Promise((resolve, reject) => {
            moip.customer
                .getOne(cusID)
                .then((response) => {
                    resolve(response.body)
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
    },
    async createClient(infos) {
        return new Promise((resolve, reject) => {
            const {
                ownId,
                fullname,
                email,
                birthDate,
                cpf,
                countryCode,
                areaCode,
                phoneNumber,
                street,
                streetNumber,
                complement,
                district,
                city,
                state,
                country,
                zipCode,
            } = infos

            moip.customer
                .create({
                    ownId,
                    fullname,
                    email,
                    birthDate,
                    taxDocument: {
                        type: 'CPF',
                        number: cpf,
                    },
                    phone: {
                        countryCode,
                        areaCode,
                        number: phoneNumber,
                    },
                    shippingAddress: {
                        city,
                        complement,
                        district,
                        street,
                        streetNumber,
                        zipCode,
                        state,
                        country,
                    },
                })
                .then((response) => {
                    resolve(response.body)
                })
                .catch((err) => {
                    console.log(`Erro ao criar cliente wirecard`, err)
                    reject(err)
                })
        })
    },
    async authorize() {
        return new Promise((resolve, reject) => {
            const config = {
                response_type: 'code',
                client_id: appId,
                redirect_uri: redirectUri,
                scopes: ['RECEIVE_FUNDS', 'REFUND'],
            }

            axios
                .get(`https://connect-sandbox.moip.com.br/oauth/authorize`, {
                    params: {
                        response_type: 'code',
                        client_id: appId,
                        redirect_uri: redirectUri,
                        scopes: 'RECEIVE_FUNDS,REFUND',
                    },
                    headers: {
                        authorization: `OAuth ${accessToken}`,
                    },
                })
                .then((url) => {
                    return resolve(url.data)
                })
                .catch((err) => {
                    console.log('Retorno de erro ao autorizar usuário', err)
                    return reject({
                        name: `WireError`,
                        message: err,
                    })
                })
            /* moip.connect
                .getAuthorizeUrl(config, config)
                .then((url) => {
                    return resolve(url)
                })
                .catch((err) => {
                    console.log('Retorno de erro ao autorizar usuário', err)
                    return reject({
                        name: `WireError`,
                        message: err,
                    })
                }) */
        })
    },
    async consultAccount(accountId) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const account = await moip.account.getOne(accountId)

                return resolve(account.body)
            } catch (error) {
                return reject(error)
            }
        })
    },
    async checkAccount(cpf) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => {
            const AuthStr = 'OAuth '.concat(accessToken)
            moip.account
                .exists({
                    tax_document: cpf,
                })
                .then((res) => {
                    return resolve({ message: `the account exists`, status: 200, body: res.toJSON() })
                })
                .catch(() => {
                    return resolve({ message: `user not exist`, status: 404 })
                })
        })
    },
    async createAccount(informations) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const {
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
                    streetNumber,
                    district,
                    zipCode,
                    city,
                    state,
                    country,
                } = informations

                await validate(cpf)

                const areaCode = phone.substr(1, 2)

                const paramsC = {
                    email: {
                        address: email,
                    },
                    person: {
                        name,
                        lastName,
                        taxDocument: {
                            type: 'CPF',
                            number: cpf,
                        },
                        identityDocument: {
                            type: 'RG',
                            number: rg,
                            issuer,
                            issueDate,
                        },
                        birthDate,
                        phone: {
                            countryCode,
                            areaCode,
                            number: phone.substr(5, 11),
                        },
                        address: {
                            street,
                            streetNumber,
                            district,
                            zipCode,
                            city,
                            state,
                            country,
                        },
                    },
                    type: 'MERCHANT',
                    transparentAccount: true,
                }

                const account = await moip.account.create(paramsC)

                return resolve(account.body)
            } catch (error) {
                return reject(error)
            }
        })
    },
}
