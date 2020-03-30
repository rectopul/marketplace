const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Manager = require('../models/Manager')
const Address = require("../models/Address");
const Stores = require('../models/Stores')
const Product = require('../models/Product')
const ImagesProducts = require('../models/ImageProduct')
const Variation = require('../models/Variation')
const VariationMap = require('../models/VariationMap')
const Categories = require('../models/Categories')
const CategoryMap = require('../models/CategoryMap')
const Banners = require('../models/Banners')
const ImagesBanners = require('../models/ImagesBanners')
const Image = require('../models/Image')

const Order = require('../models/Order')
const DeliveryAddress = require('../models/DeliveryAddress')
const ProductOrder = require('../models/ProductOrder')

const Client = require('../models/Client')
const Cart = require('../models/Cart')
const CartProduct = require('../models/CartProduct')

const connection = new Sequelize(dbConfig);

User.init(connection)
Manager.init(connection)
Address.init(connection);
Image.init(connection)
Stores.init(connection);
Product.init(connection);
ImagesProducts.init(connection);
ImagesBanners.init(connection)
Variation.init(connection);
VariationMap.init(connection)
Categories.init(connection)
CategoryMap.init(connection)
Banners.init(connection)

Order.init(connection)
DeliveryAddress.init(connection)
ProductOrder.init(connection)

Client.init(connection)
Cart.init(connection)
CartProduct.init(connection)

User.associate(connection.models)
Manager.associate(connection.models)
Address.associate(connection.models);
Stores.associate(connection.models);
Product.associate(connection.models);
ImagesProducts.associate(connection.models);
Variation.associate(connection.models);
VariationMap.associate(connection.models)
Categories.associate(connection.models)
CategoryMap.associate(connection.models)
Banners.associate(connection.models)

Order.associate(connection.models)
Client.associate(connection.models)
DeliveryAddress.associate(connection.models)
ProductOrder.associate(connection.models)
Cart.associate(connection.models)
CartProduct.associate(connection.models)

module.exports = connection;
