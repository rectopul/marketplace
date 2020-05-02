const soap = require('soap')

module.exports = async (env) => {
    try {
        let url = `https://apphom.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl`

        if (env == `prod`) url = `https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl`

        if (env == `calc`) url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl`

        const clientCalc = (args) => {
            const calcArgs = {
                nCdFormato: 1,
                nCdEmpresa: '',
                sDsSenha: '',
                sCdMaoPropria: 'N',
                nVlValorDeclarado: 0,
                sCdAvisoRecebimento: 'N',
            }

            let arg = Object.assign({}, calcArgs, args)

            //console.log(`Args`, arg);

            return new Promise((resolve, reject) => {
                soap.createClient(url, (error, client) => {
                    if (error) return reject(error)
                    client.CalcPrecoPrazo(arg, (error, result) => {
                        if (
                            !error &&
                            result &&
                            result.CalcPrecoPrazoResult &&
                            result.CalcPrecoPrazoResult.Servicos &&
                            result.CalcPrecoPrazoResult.Servicos.cServico
                        ) {
                            return resolve(result.CalcPrecoPrazoResult.Servicos.cServico[0])
                        }

                        return reject(error)
                    })
                })
            })
        }

        let sigepClient = (client) => {
            return {
                CalcPrecoPrazo: (params) => {
                    return new Promise((resolve, reject) => {
                        const { sCepOrigem, sCepDestino, nVlPeso, nVlComprimento, nVlAltura, nVlLargura, nVlDiametro } = params

                        const result = [`04510`, `04014`].map((item) => {
                            return clientCalc({
                                nCdServico: item,
                                sCepOrigem,
                                sCepDestino,
                                nVlPeso,
                                nCdFormato: 1,
                                nVlComprimento,
                                nVlAltura,
                                nVlLargura,
                                nVlDiametro,
                            })
                        })

                        Promise.all(result)
                            .then((result) => {
                                result.map((item) => {
                                    if (item.MsgErro) return reject({ name: `SigepError`, message: item.MsgErro })
                                })

                                return resolve({
                                    SEDEX: result[1],
                                    PAC: result[0],
                                })
                            })
                            .catch((err) => {
                                console.log(`Resultado: `, err)
                                return reject(err)
                            })
                    })
                },
                servicos: (params) => {
                    return new Promise((resolve, reject) => {
                        const { idContrato, idCartaoPostagem, usuario, senha } = params

                        client.buscaCliente(
                            {
                                idContrato,
                                idCartaoPostagem,
                                usuario,
                                senha,
                            },
                            (err, res) => {
                                if (err) return reject(err)

                                return resolve(res.return)
                            }
                        )
                    })
                },
                disponibilidadeServico: (params) => {
                    return new Promise((resolve, reject) => {
                        const { codAdministrativo, numeroServico, cepOrigem, cepDestino, usuario, senha } = params
                        client.verificaDisponibilidadeServico(
                            {
                                codAdministrativo,
                                numeroServico,
                                cepOrigem,
                                cepDestino,
                                usuario,
                                senha,
                            },
                            (err, res) => {
                                if (err) return reject(err)

                                return resolve(res)
                            }
                        )
                    })
                },
                buscarCep: (cep) => {
                    return new Promise((resolve, reject) => {
                        client.consultaCEP({ cep }, (err, result) => {
                            if (err) return reject(err)

                            return resolve(result.return)
                        })
                    })
                },
            }
        }

        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                if (err) return reject(err)

                //sigepClient = client
                return resolve(sigepClient(client))
            })

            //console.log(`Sigep`, clientSoap);
        })
    } catch (error) {
        return console.log(error)
    }
}
