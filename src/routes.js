const express = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')

const UserController = require('./controllers/UserController')
const ManagerController = require(`./controllers/ManagerController`)
const AddressController = require('./controllers/AddressController')
const StoresController = require('./controllers/StoresController')
const ImageProductController = require('./controllers/ImageProductController')
const ImagesBannersController = require('./controllers/ImagesBannersController')
const BannersController = require('./controllers/BannersController')
const CategoriesController = require('./controllers/CategoriesController')
const ImageController = require('./controllers/ImageController')

/**
 * Product
 */
const ProductController = require('./controllers/ProductController')
const Coupon = require('./controllers/CouponController')

const VariationController = require('./controllers/VariationController')
const VariableMapController = require('./controllers/VariableMapController')

const SessionController = require('./controllers/SessionController')

const routes = express.Router()

const credentials = require('./middlewares/UserCredentials')
const ClientCredentials = require('./middlewares/ClientCredentials')
const StoreManager = require('./middlewares/storeManagerCredentials')
const StoreAdministrator = require('./middlewares/storeAdministratorCredentials')
const ShippingController = require('./controllers/ShippingController')

const ClientController = require('./controllers/ClientController')
const OrderController = require('./controllers/OrderController')
const DeliveryAddressController = require('./controllers/DeliveryAddressController')
const SessionClientController = require('./controllers/SessionClientController')
const CartController = require('./controllers/CartController')
const CartProduct = require('./controllers/CartProductController')

const payment = require('./modules/payment')
const paymentAccount = require('./controllers/WireCardController')

//Test de rota
routes.get(`/`, (req, res) => {
    return res.status(200).send({ message: `Rota principal` })
})

routes.get('/moip', payment.redirectUri)
routes.get('/moipclientlist', (req, res) => {
    payment
        .listClients()
        .then((response) => {
            return res.json(response)
        })
        .catch((err) => {
            return res.status(400).send(err)
        })
})

//Listagem de produtos
routes.get('/product/:product_id', ProductController.index)
routes.get('/products', ProductController.allstore)
//Listagem de produtos por categoria
routes.get('/categories/:slug?', CategoriesController.index)

//Carrinho de compras
routes.post(`/cart/create`, CartController.create)
routes.get(`/cart/list/:session_id?`, CartController.list)
routes.put(`/cart/add/:cart_id`, CartProduct.create)
routes.delete(`/cart/:cart_id`, CartProduct.remove)
routes.delete(`/cart/product/:cart_id/:session_id`, CartProduct.remove)

/* Clientes */
routes.post(`/client`, ClientController.store)
routes.get(`/client`, ClientController.index)

/* Forgot e Recuperação de senha Client */
routes.post('/client/forgot', ClientController.forgot)
routes.post('/client/reset_password', ClientController.reset)

/* Forgot e Recuperação de senha */
routes.post('/forgot', UserController.forgot)
routes.post('/reset_password', UserController.reset)

/* Session */
routes.post(`/sessions`, SessionController.store)
/* Facebook */
routes.post(`/fb-login`, SessionClientController.fbLogin)
/* session client */
routes.post(`/sessions/client`, SessionClientController.store)

/** Shipping */
routes.get(`/shipping/:product_id`, ShippingController.index)
routes.post(`/shipping/:order_id`, ShippingController.store)

routes.use(ClientCredentials)
//Atualizar client
routes.put(`/client`, ClientController.update)

//Images
routes.post(`/image/upload`, multer(multerConfig).single('file'), ImageController.store)
//Image client
routes.post(`/client/image`, multer(multerConfig).single('file'), ClientController.image)

//Visualizar carrinhos
routes.get(`/cart/list/:store_id`, CartController.list)

/* Endereços de entrega */
routes.post('/delivery', DeliveryAddressController.store)
routes.get('/delivery/:delivery_id?', DeliveryAddressController.index)
routes.delete('/delivery/:delivery_id', DeliveryAddressController.delete)
routes.put('/delivery/:delivery_id', DeliveryAddressController.update)

/* Pedidos */
routes.post('/order', OrderController.store)
routes.get('/order/:order_id?', OrderController.index)
routes.get('/order/adm/:store_id/:order_id?', OrderController.admIndex)
routes.put('/order/cancel/:order_id', OrderController.cancel)
routes.put('/order/:order_id', OrderController.update)
routes.delete('/order/:order_id', OrderController.delete)
routes.post('/customers', paymentAccount.createClient)

//Cupons
routes.patch(`/coupon/:order_id/:coupon_code`, Coupon.insert)

/**
 * Authentication
 */

routes.use(StoreManager)

//Copons
routes.post(`/coupon/:store_id/:client_id?`, Coupon.Store)

//Visualizar carrinhos
//routes.get(`/cart/list/:store_id`, CartController.list)
routes.get(`/cart/listall`, CartController.listAll)

//Client Manager
routes.put(`/client/enable/:client_id`, ClientController.clientActive)
routes.put(`/client/disable/:client_id`, ClientController.clientDisable)

/* Stores */
routes.get('/store', StoresController.index)
routes.post('/store/create', StoresController.store)
routes.delete('/store/:store_id', StoresController.delete)
routes.put(`/store/:store_id`, StoresController.storeUpdate)

/* Banners da Loja */
routes.get('/banners/:store_id', BannersController.index)
routes.post('/banners/:store_id', BannersController.store)
routes.delete('/banners/:banner_id', BannersController.delete)
routes.put('/banners/:banner_id', BannersController.update)
/* Pegar imagens Banner por localização */
routes.get('/banners/:store_id/:location', BannersController.location)

/* Products */
routes.post('/product/:store_id/create', ProductController.create)
routes.delete(`/product/delete/:product_id`, ProductController.productDelete)
routes.put(`/product/update/:product_id`, ProductController.productUpdate)

/* Images Products */
routes.post('/image/:id_product/product', multer(multerConfig).single('file'), ImageProductController.store)
routes.get('/image/:id_product/product', ImageProductController.index)
routes.delete('/image/:id', ImageProductController.delete)

/* Images Banners */
routes.post('/image/banner', multer(multerConfig).single('file'), ImagesBannersController.store)
routes.get('/image/banner/:image_id', ImagesBannersController.index)
routes.delete('/image/banner/:image_id', ImagesBannersController.delete)

/* Variations */
routes.post('/product/maping/variation', VariableMapController.store)
routes.post('/:store_id/product/create/variation', VariationController.store)
routes.get('/product/:store_id/:product_id/variation', VariationController.index)
routes.delete('/variation/:variation_id', VariationController.delete)
/* UPDATE */
routes.post('/variation/:store_id/:variation_id', VariationController.update)

/* Categories */
routes.post('/insert/:store_id/category', CategoriesController.store)
routes.put('/category/:caregory_id/:product_id?', CategoriesController.update)
routes.delete('/category/:caregory_id/:product_id?', CategoriesController.delete)

/* Somente Administrador e super user */
routes.use(StoreAdministrator)
routes.post(`/manager/:store_id`, ManagerController.store)
routes.get(`/manager`, ManagerController.index)
routes.delete(`/manager/:manager_id`, ManagerController.delete)
routes.put(`/manager/:manager_id`, ManagerController.update)

//somente superuser
routes.use(credentials)
routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.get('/user', UserController.single)

/* Informações de usuários */
routes.get('/users/:user_id/addresses', AddressController.index)
routes.post('/users/addresses', AddressController.store)

module.exports = routes
