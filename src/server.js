require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
//const Sigep = require('./modules/Sigep')

require('./database')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
app.use(morgan('dev'))
app.use(routes)

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' })
})

/* Sigep('calc').then((sigepClient) => {
    const params = {
        nCdEmpresa: ``,
        sDsSenha: ``,
        nCdServico: `04014`,
        sCepOrigem: `16480100`,
        sCepDestino: `17500010`,
        nVlPeso: `2`,
        nCdFormato: 1,
        nVlComprimento: 60,
        nVlAltura: 25,
        nVlLargura: 25,
        nVlDiametro: 30,
        sCdMaoPropria: `N`,
        nVlValorDeclarado: 0,
        sCdAvisoRecebimento: `N`,
    }

    sigepClient
        .CalcPrecoPrazo(params)
        .then((end) => {
            console.log(end)
        })
        .catch((err) => {
            console.log(err)
        })
}) */

app.listen(process.env.PORT || 3333)
