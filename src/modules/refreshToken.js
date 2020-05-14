const request = require('request')
const url = process.env.MELHORENVIO_URL

module.exports = {
    async refreshToken(params) {
        return new Promise((resolve, reject) => {
            const { refreshToken, client_id, client_secret } = params
            var options = {
                method: 'POST',
                url: `${url}/oauth/token`,
                headers: {
                    Accept: 'application/json',
                },
                formData: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id,
                    client_secret,
                },
            }
            request(options, function (error, response) {
                if (error) return reject({ name: `mEnvioError`, message: error })
                return resolve(JSON.parse(response.body))
            })
        })
    },
}
