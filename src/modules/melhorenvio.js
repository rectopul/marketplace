const axios = require('axios')
const callback = `https://wecheckoutapi.herokuapp.com/envio`
const url = `https://sandbox.melhorenvio.com.br`

module.exports = {
    async token(req, res) {
        try {
            const { client_id, client_secret } = req.body
            const { code } = req.query

            /* let bodyFormData = new FormData()

            bodyFormData.set('grant_type', 'authorization_code')
            bodyFormData.set('client_id', client_id)
            bodyFormData.set('client_secret', client_secret)
            bodyFormData.set('redirect_uri', callback)
            bodyFormData.set('code', code) */

            const parameters = {
                grant_type: 'authorization_code',
                client_id,
                client_secret,
                redirect_uri: callback,
                code,
            }

            if (code) return res.json(code)

            const scopes = `shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write webhooks-read webhooks-write`

            const urlEnvio = `${url}/oauth/authorize?client_id=${client_id}&redirect_uri=${callback}&response_type=code&scope=${scopes}`

            /* const generateToken = await axios({
                method: 'post',
                url: urlEnvio,
                data: parameters,
                headers: { 'Content-Type': 'application/json' },
            }) */

            console.log(`Retorno do axios`, urlEnvio)

            return res.json(urlEnvio)
        } catch (error) {
            console.log(error)
            return res.status(400).send({ error })
        }
    },
}
