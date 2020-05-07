//Rastreamento correios

const { createClientAsync } = require('soap')

module.exports = async (objetos) => {
    const url = `http://webservice.correios.com.br/service/rastro/Rastro.wsdl`

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const modulos = await createClientAsync(url)

            const args = {
                usuario: `ECT`,
                senha: `SRO`,
                tipo: `L`,
                resultado: `T`,
                lingua: `101`,
                objetos,
            }

            const buscaEventos = await modulos.buscaEventosAsync(args)

            return resolve(buscaEventos[0].return)
        } catch (error) {
            return reject(error)
        }
    })
}
