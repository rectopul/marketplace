/* eslint-disable no-unused-vars */
const accessToken = `5fab11f56c1b4e81ab7bd1b065aba4a8_v2`
const token = `OJTJZAMDPYN8VG4W8QVNM9TV4E33D8WA`
const chave = `XN653LFP0Y5ZCGPMA2S3ZPQRKGPINCFGCJUPIR6X`
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

module.exports = {
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

                const areaCode = phone.substr(1, 2)

                const account = await moip.account.create({
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
                    transparentAccount: false,
                })

                resolve(account.body)
            } catch (error) {
                return reject(error)
            }
        })
    },
}
