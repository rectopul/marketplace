<<<<<<< HEAD
require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

const express = require("express");
const routes = require("./routes");

require("./database");

const app = express();

app.use(express.json());
app.use(routes);

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(3333);
=======
require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const express = require('express');
const routes = require('./routes');

require('./database');

const app = express();

app.use(express.json());
app.use(routes);

app.use((req, res) => {
	res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(process.env.PORT || 3333);
>>>>>>> cca3b28560c3e2d78053e2667f0c9560bfd5a64b
