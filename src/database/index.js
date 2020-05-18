const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const User = require('../models/User')
const Manager = require('../models/Manager')
const Address = require('../models/Address')
const Stores = require('../models/Stores')
const Product = require('../models/Product')
const ImagesProducts = require('../models/ImageProduct')
const ProductRating = require('../models/ProductRating')
const Variation = require('../models/Variation')
const VariationMap = require('../models/VariationMap')
const Categories = require('../models/Categories')
const CategoryMap = require('../models/CategoryMap')
const Banners = require('../models/Banners')
const ImagesBanners = require('../models/ImagesBanners')
const Image = require('../models/Image')

const Order = require('../models/Order')
const OrderDelivery = require('../models/OrderDelivery')
const DeliveryAddress = require('../models/DeliveryAddress')
const ProductOrder = require('../models/ProductOrder')
const Coupon = require('../models/Coupon')

const Client = require('../models/Client')
const Cart = require('../models/Cart')
const CartProduct = require('../models/CartProduct')

//Wirecard
const ClientCard = require('../models/ClientCard')
const Payment = require('../models/Payment')

//Melhor envio
const MelhorEnvio = require('../models/MelhorEnvio')
const Shipping = require('../models/Shipping')

const connection = new Sequelize(dbConfig)

User.init(connection)
Manager.init(connection)
Address.init(connection)
Image.init(connection)
Stores.init(connection)
Product.init(connection)
ProductRating.init(connection)
ImagesProducts.init(connection)
ImagesBanners.init(connection)
Variation.init(connection)
VariationMap.init(connection)
Categories.init(connection)
CategoryMap.init(connection)
Banners.init(connection)

Order.init(connection)
OrderDelivery.init(connection)
DeliveryAddress.init(connection)
ProductOrder.init(connection)
Coupon.init(connection)

Client.init(connection)
Cart.init(connection)
CartProduct.init(connection)

//melhor envio
MelhorEnvio.init(connection)
Shipping.init(connection)

//Wirecard
ClientCard.init(connection)
Payment.init(connection)

User.associate(connection.models)
Manager.associate(connection.models)
Address.associate(connection.models)
Stores.associate(connection.models)
Product.associate(connection.models)
ImagesProducts.associate(connection.models)
Variation.associate(connection.models)
VariationMap.associate(connection.models)
Categories.associate(connection.models)
CategoryMap.associate(connection.models)
Banners.associate(connection.models)

Order.associate(connection.models)
OrderDelivery.associate(connection.models)
Client.associate(connection.models)
DeliveryAddress.associate(connection.models)
ProductOrder.associate(connection.models)
ProductRating.associate(connection.models)
Coupon.associate(connection.models)
Cart.associate(connection.models)
CartProduct.associate(connection.models)

//melhor envio
MelhorEnvio.associate(connection.models)
Shipping.associate(connection.models)

//Wirecard
ClientCard.associate(connection.models)
Payment.associate(connection.models)

module.exports = connection
