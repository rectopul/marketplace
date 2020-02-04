const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Address = require("../models/Address");
const Stores = require('../models/Stores')
const Product = require('../models/Product')
const ImagesProducts = require('../models/ImageProduct')
const Variation = require('../models/Variation')
const Categories = require('../models/Categories')
const CategoryMap = require('../models/CategoryMap')
const ProductVariations = require('../models/ProductVariations')

const connection = new Sequelize(dbConfig);

User.init(connection);
Address.init(connection);
Stores.init(connection);
Product.init(connection);
ImagesProducts.init(connection);
Variation.init(connection);
ProductVariations.init(connection)
Categories.init(connection)
CategoryMap.init(connection)

User.associate(connection.models);
Address.associate(connection.models);
Stores.associate(connection.models);
Product.associate(connection.models);
ImagesProducts.associate(connection.models);
Variation.associate(connection.models);
ProductVariations.associate(connection.models)
Categories.associate(connection.models)
CategoryMap.associate(connection.models)


module.exports = connection;
