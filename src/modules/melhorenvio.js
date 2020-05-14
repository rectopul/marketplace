/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
const axios = require('axios')
const request = require('request')
const callback = `https://wecheckoutapi.herokuapp.com/envio`
const url = process.env.MELHORENVIO_URL
const codeTest = process.env.MELHORENVIO_CODE

const mToken = process.env.MELHORENVIO_TOKEN
const mRefeshToken = process.env.MELHORENVIO_RTOKEN

const User = require('../models/User')
const Client = require('../models/Client')
const Product = require('../models/Product')
const userByToken = require('../middlewares/userByToken')
const MelhorEnvio = require('../models/MelhorEnvio')

const mailer = require('./mailer')

module.exports = {
    async authorize(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const user = await User.findByPk(user_id)

            const { client_id, client_secret } = req.body
            //const { code } = req.query

            //if (code) return res.json(code)

            const scopes = `shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write`

            const urlEnvio = `${url}/oauth/authorize?client_id=${client_id}&redirect_uri=${callback}&response_type=code&scope=${scopes}`

            const { email, name } = user

            mailer.sendMail(
                {
                    to: email,
                    from: process.env.MAIL_FROM,
                    subject: 'WeCheckout Generate Token!',
                    template: 'auth/link_melhor',
                    context: { name, link: encodeURI(urlEnvio) },
                },
                (err) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).send({ error: 'Cannot send forgot password email' })
                    }
                    return res.send()
                }
            )
        } catch (error) {
            console.log(error)
            return res.status(400).send({ error })
        }
    },
    async token(req, res) {
        try {
            const { client_id, client_secret, code } = req.body

            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const user = await User.findByPk(user_id, { include: { association: `melhorEnvio` } })

            const { melhorEnvio } = user

            //check se existe integração
            if (melhorEnvio.length)
                return res.status(400).send({ error: `User is already integrated into the best submission` })

            var options = {
                method: 'POST',
                url: `${url}/oauth/token`,
                headers: {
                    Accept: 'application/json',
                },
                formData: {
                    grant_type: 'authorization_code',
                    client_id,
                    client_secret,
                    redirect_uri: `${callback}`,
                    code,
                },
            }

            await request(options, async (error, response) => {
                if (error) return res.json({ message: `Erro no request`, error })
                const { expires_in, refresh_token, access_token } = JSON.parse(response.body)

                const minutes = expires_in / 60
                const hours = minutes / 60
                const days = hours / 24
                const now = new Date()
                now.setDate(now.getDay() + days)
                const envio = await MelhorEnvio.create({
                    code,
                    token: access_token,
                    refreshToken: refresh_token,
                    token_expires: now,
                    active: true,
                    user_id,
                })
                return res.json(envio)
            })

            //console.log(`Retorno do axios`, urlEnvio)
        } catch (error) {
            console.log(error)
            return res.status(400).send({ error })
        }
    },

    async calculateShipping(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { client_id } = await userByToken(authHeader)

            const { product_id, quantity } = req.params

            //buscar cliente, endereço de entrega
            const client = await Client.findByPk(client_id, {
                include: { association: `delivery_addresses`, where: { active: true } },
            })

            if (!client.delivery_addresses.length) return res.status(400).send({ error: `Register a delivery address` })

            const clientPostalCode = client.delivery_addresses[0].zipcode
            //buscar o produto, loja, usuario e informações de integração
            const product = await Product.findByPk(product_id, {
                include: {
                    association: `stores`,
                    include: { association: `user`, include: { association: `melhorEnvio` } },
                },
            })

            if (!product) return res.status(400).send({ error: `This product not exists` })

            const { melhorEnvio } = product.stores.user

            //pegar dimensões do produto
            const { width, height, length, weight } = product
            //Pegar codigo postal da loja
            const { zipcode: storeZipcode } = product.stores
            //check se existe integração
            if (!melhorEnvio.length)
                return res.status(400).send({ error: `User is not integrated in the best submission` })

            const token = melhorEnvio[0].token
            let options = {
                method: 'POST',
                url: `${url}/api/v2/me/shipment/calculate`,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            if (quantity > 1) {
                options.body = JSON.stringify({
                    from: { postal_code: storeZipcode },
                    to: { postal_code: clientPostalCode },
                    options: { receipt: false, own_hand: false },
                    services: '1,2',
                    products: [
                        {
                            id: 'x',
                            width,
                            height,
                            length,
                            weight,
                            insurance_value: parseFloat(product.price) * quantity,
                            quantity,
                        },
                    ],
                })
            } else {
                options.body = JSON.stringify({
                    from: { postal_code: storeZipcode },
                    to: { postal_code: clientPostalCode },
                    package: { width, height, length, weight, insurance_value: product.price, quantity },
                    options: { insurance_value: product.price, receipt: false, own_hand: false },
                    services: '1,2,3,4,7,11',
                })
            }

            request(options, function (error, response) {
                if (error) throw new Error(error)
                //console.log(response.body)
                const mres = JSON.parse(response.body)
                var min = mres
                    .map((item) => {
                        if (item.price) return parseInt(parseFloat(item.price) * 100)
                    })
                    .filter((el) => {
                        return el != null
                    })
                return res.json({
                    melhorEnvio: mres,
                    menorValor: Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        Math.min(...min) / 100
                    ),
                })
            })
        } catch (error) {
            console.log(error)
            return res.status(400).send({ error })
        }
    },

    async addToCart(informations, agency) {
        return new Promise(async (resolve, reject) => {
            try {
                const { product_id, client_id, store_note, client_note, quantity } = informations

                //pegar produto, loja, e melhor envios
                const product = await Product.findByPk(product_id, {
                    include: {
                        association: `stores`,
                        include: { association: `user`, include: { association: `melhorEnvio` } },
                    },
                })

                let productPrice = product.price

                //Pegar preço promocional do produto
                if (product.promotional_price) productPrice = product.promotional_price

                //check se existe integração
                const { melhorEnvio } = product.stores.user

                if (!melhorEnvio.length)
                    return reject({
                        name: `bestSubmissionError`,
                        message: `Loja não possúi integração com melhor envio`,
                    })

                const { token } = melhorEnvio[0]

                //console.log(`Token Melhor: `, melhorEnvio[0].token)

                const from = {
                    name: product.stores.nameStore,
                    phone: product.stores.phone.replace(/\(|\)|-/g, '').replace(' ', ''),
                    email: product.stores.email,
                    document: product.stores.cpf.replace(/\.|-/g, ''),
                    address: product.stores.street,
                    complement: ``,
                    number: `${product.stores.number}`,
                    district: product.stores.district,
                    city: product.stores.city,
                    country_id: product.stores.country.substr(0, 2),
                    postal_code: product.stores.zipcode.replace(/-/g, ''),
                    note: store_note || ``,
                }

                //dados do cliente
                const client = await Client.findByPk(client_id, { include: { association: `delivery_addresses` } })

                //check if client have wireId
                if (!client.wireId)
                    return reject({ name: `bestSubmissionError`, message: `Cliente não possúi conta wirecard` })

                //Check se existe endereço de entrega
                const { delivery_addresses } = client

                if (!delivery_addresses.length)
                    return reject({ name: `bestSubmissionError`, message: `Cliente não possúi Endereço de entrega` })

                const to = {
                    name: delivery_addresses[0].name,
                    phone: delivery_addresses[0].phone.replace(/\(|\)|-/g, '').replace(' ', ''),
                    email: client.email,
                    document: delivery_addresses[0].cpf.replace(/\.|-/g, ''),
                    address: delivery_addresses[0].street,
                    complement: delivery_addresses[0].address_type,
                    number: `${delivery_addresses[0].number}`,
                    district: delivery_addresses[0].address,
                    city: delivery_addresses[0].city,
                    state_abbr: delivery_addresses[0].state,
                    country_id: client.country.substr(0, 2),
                    postal_code: delivery_addresses[0].zipcode.replace(/-/g, ''),
                    note: client_note || ``,
                }

                var options = {
                    method: 'POST',
                    url: `${url}/api/v2/me/cart`,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        service: 2,
                        agency: agency || '',
                        from,
                        to,
                        products: [{ name: product.title, quantity, unitary_value: productPrice }],
                        volumes: [
                            {
                                height: product.height * quantity,
                                width: product.width * quantity,
                                length: product.length * quantity,
                                weight: product.weight * quantity,
                            },
                        ],
                        options: {
                            insurance_value: `${parseFloat(parseFloat(product.price) * quantity)}`,
                            receipt: false,
                            own_hand: false,
                            reverse: false,
                            non_commercial: true,
                            invoice: {
                                key: '',
                            },
                        },
                    }),
                }

                request(options, function (error, response) {
                    if (error) return reject(error)
                    if (JSON.parse(response.body).message == 'Unauthenticated.')
                        return reject({ name: `bestSubmissionError`, message: `Unauthenticated in Melhor envio` })
                    if (response.statusCode == 500)
                        return reject({ name: `bestSubmissionError`, message: JSON.parse(response.body).error })
                    return resolve(JSON.parse(response.body))
                })
            } catch (error) {
                //Validação de erros
                if (error.name == `JsonWebTokenError`) reject({ error })

                console.log(`Erro ao criar adicionar etiqueta no carrinho: `, error)
                if (error.name == `SequelizeValidationError` || error.name == `SequelizeUniqueConstraintError`)
                    return reject({ error: error.message })

                return reject({ error: `Erro de servidor` })
            }
        })
    },
}