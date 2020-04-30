const Product = require('../models/Product')
const Sigep = require('../modules/Sigep')
const userByToken = require('../middlewares/userByToken')
const Client = require('../models/Client')

class SessionController {
    async store(req, res) {
        try {
            const { product_id } = req.params
            //Get user id by token
            const authHeader = req.headers.authorization

            const { client_id } = await userByToken(authHeader)

            const product = await Product.findByPk(product_id, {
                include: { association: `store` },
            })

            const client = await Client.findByPk(client_id, {
                include: {
                    association: `delivery_addresses`,
                    where: { active: true },
                },
            })

            const sigep = await Sigep('calc')

            const params = {
                sCepOrigem: product.store.zipcode,
                sCepDestino: client.delivery_addresses.zipcode,
                nVlPeso: product.weight,
                nVlComprimento: product.length,
                nVlAltura: product.height,
                nVlLargura: product.width,
                nVlDiametro: 0,
            }

            const frete = await sigep.CalcPrecoPrazo(params)

            return res.json({
                product,
                client,
                frete,
            })
        } catch (error) {
            console.log(`Erro de sessão: `, error)
        }
    }
}

module.exports = new SessionController()
