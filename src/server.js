require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
//const Sigep = require('./modules/Sigep')
//const Rastro = require('./modules/Rastro')

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

app.listen(process.env.PORT || 3333)
