<<<<<<< HEAD
const express = require("express");

const UserController = require("./controllers/UserController");
const AddressController = require("./controllers/AddressController");

const SessionController = require("./controllers/SessionController");

const routes = express.Router();

const authMiddleware = require("./middlewares/auth");

/**
 * Session
 */

routes.post("/sessions", SessionController.store);

/**
 * Authentication
 */

routes.use(authMiddleware);

routes.get("/users", UserController.index);
routes.post("/users", UserController.store);

routes.get("/users/:user_id/addresses", AddressController.index);
routes.post("/users/:user_id/addresses", AddressController.store);

/**
 * Autencicação
 */

routes.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserController;
});

/**
 * Dashboard
 */

routes.get("/dashboard", (req, res) => {
    return res.status(200).send();
});

module.exports = routes;
=======
const express = require('express');

const UserController = require('./controllers/UserController');
const AddressController = require('./controllers/AddressController');

const SessionController = require('./controllers/SessionController');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');

/**
 * Session
 */

routes.post('/sessions', SessionController.store);

/**
 * Authentication
 */

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.get('/users/:user_id/addresses', AddressController.index);
routes.post('/users/:user_id/addresses', AddressController.store);

/**
 * Autencicação
 */

routes.post('/authenticate', async (req, res) => {
	const { email, password } = req.body;

	const user = await UserController;
});

/**
 * Dashboard
 */

routes.get('/dashboard', (req, res) => {
	return res.status(200).send();
});

module.exports = routes;
>>>>>>> cca3b28560c3e2d78053e2667f0c9560bfd5a64b
