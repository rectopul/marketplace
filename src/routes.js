const express = require("express");
const multer = require('multer')
const multerConfig = require('./config/multer')

const UserController = require("./controllers/UserController");
const AddressController = require("./controllers/AddressController");
const StoresController = require('./controllers/StoresController')
const ImageProductController = require('./controllers/ImageProductController')
const CategoriesController = require('./controllers/CategoriesController')

/**
 * Product
 */
const ProductController = require('./controllers/ProductController')

const VariationController = require('./controllers/VariationController')

const SessionController = require("./controllers/SessionController");

const routes = express.Router();

const authMiddleware = require("./middlewares/auth");

const credentials = require('./middlewares/UserCredentials');


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

/* Products */
routes.post("/product/:store_id/create", ProductController.create);
routes.get("/store/:store_id/product", ProductController.index);
routes.get("/product/:store_id/:product_id", ProductController.store);

/* Images Products */
routes.post('/image/:id_product/product', multer(multerConfig).single('file'), ImageProductController.store)
routes.get('/image/:id_product/product', ImageProductController.index)
routes.delete('/image/:id', ImageProductController.delete)

/* Variations */
routes.post("/product/:store_id/:product_id/variation", VariationController.store);
routes.get("/product/:store_id/:product_id/variation", VariationController.mult);
routes.get("/variation/:id", VariationController.index);
/* UPDATE */
routes.post("/variation/:store_id/:variation_id", VariationController.update);

/* Categories */
routes.post('/insert/:store_id/category', CategoriesController.store)
routes.get('/store/:store_id/category', CategoriesController.index)
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
