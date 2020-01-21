const express = require("express");

const UserController = require("./controllers/UserController");
const AddressController = require("./controllers/AddressController");
const StoresController = require('./controllers/StoresController')

const SessionController = require("./controllers/SessionController");

const routes = express.Router();

const authMiddleware = require("./middlewares/auth");

const credentials = require('./middlewares/UserCredentials');

/**
 * CORS
 */
routes.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS')
    next()
})

/**
 * Session
 */

routes.post("/sessions", SessionController.store);

/**
 * Authentication
 */

routes.use(authMiddleware);

routes.use(credentials)
routes.get("/users", UserController.index);
routes.use(credentials)
routes.post("/users", UserController.store);

routes.get("/users/:user_id/addresses", AddressController.index);
routes.post("/users/:user_id/addresses", AddressController.store);

/* Stores */
routes.get("/users/:user_id/store", StoresController.index);
routes.post("/users/:user_id/store", StoresController.store);


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
