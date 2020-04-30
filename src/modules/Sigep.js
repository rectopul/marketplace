const soap = require('soap')

module.exports = async (env) => {
    try {

        let url = `https://apphom.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl`

        if (env == `prod`)
            url = `https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl`


        if (env == `calc`)
            url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl`

        let sigepClient = (client) => {
            return {
                CalcPrecoPrazo: params => {
                    return new Promise(async (resolve, reject) => {
                        const {
                            nCdEmpresa,
                            sDsSenha,
                            nCdServico,
                            sCepOrigem,
                            sCepDestino,
                            nVlPeso,
                            nCdFormato,
                            nVlComprimento,
                            nVlAltura,
                            nVlLargura,
                            nVlDiametro,
                            sCdMaoPropria,
                            nVlValorDeclarado,
                            sCdAvisoRecebimento
                        } = params

                        const Calc = (cod, client) => {
                            client.CalcPrecoPrazo({
                                nCdEmpresa: ``,
                                sDsSenha: ``,
                                nCdServico: cod,
                                sCepOrigem,
                                sCepDestino,
                                nVlPeso,
                                nCdFormato: 1,
                                nVlComprimento,
                                nVlAltura,
                                nVlLargura,
                                nVlDiametro,
                                sCdMaoPropria: `N`,
                                nVlValorDeclarado: 0,
                                sCdAvisoRecebimento: `N`
                            }, (err, res) => {
                                if (err)
                                    return reject(err)
                                //console.log(res.CalcPrecoPrazoResult.Servicos)
                                return res.CalcPrecoPrazoResult.Servicos
                            })
                        }

                        const PAC = await client.CalcPrecoPrazo({
                            nCdEmpresa: ``,
                            sDsSenha: ``,
                            nCdServico: `04510`,
                            sCepOrigem,
                            sCepDestino,
                            nVlPeso,
                            nCdFormato: 1,
                            nVlComprimento,
                            nVlAltura,
                            nVlLargura,
                            nVlDiametro,
                            sCdMaoPropria: `N`,
                            nVlValorDeclarado: 0,
                            sCdAvisoRecebimento: `N`
                        }, (err, res) => {
                            if (err)
                                return reject(err)
                            //console.log(res.CalcPrecoPrazoResult.Servicos)
                            return res.CalcPrecoPrazoResult.Servicos
                        })

                        const SEDEX = await Calc(`04014`, client)

                        return resolve({
                            PAC,
                            SEDEX
                        })

                    })
                },
                servicos: params => {
                    return new Promise((resolve, reject) => {
                        const { idContrato, idCartaoPostagem, usuario, senha } = params

                        client.buscaCliente({
                            idContrato,
                            idCartaoPostagem,
                            usuario,
                            senha
                        }, (err, res) => {
                            if (err)
                                return reject(err)

                            return resolve(res.return)
                        })
                    })
                },
                disponibilidadeServico: params => {
                    return new Promise((resolve, reject) => {
                        const { codAdministrativo, numeroServico, cepOrigem, cepDestino, usuario, senha } = params
                        client.verificaDisponibilidadeServico({
                            codAdministrativo,
                            numeroServico,
                            cepOrigem,
                            cepDestino,
                            usuario,
                            senha
                        }, (err, res) => {

                            if (err)
                                return reject(err)

                            return resolve(res)

                        })
                    })
                },
                buscarCep: cep => {
                    return new Promise((resolve, reject) => {
                        client.consultaCEP({ cep }, (err, result) => {
                            if (err)
                                return reject(err)

                            return resolve(result.return)
                        })
                    })
                }
            }
        }

        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                if (err)
                    return reject(err)

                //sigepClient = client
                return resolve(sigepClient(client))
            })

            //console.log(`Sigep`, clientSoap);
        })

    } catch (error) {

    }
}