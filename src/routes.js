const express = require("express");

const UserController = require("./controllers/UserController");
const AddressController = require("./controllers/AddressController");

const SessionController = require("./controllers/SessionController");

const routes = express.Router();

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
 * Session
 */

routes.post("/sessions", SessionController.store);

module.exports = routes;
