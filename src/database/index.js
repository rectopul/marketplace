const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Address = require("../models/Address");
const Stores = require('../models/Stores')
const Product = require('../models/Product')
const ImagesProducts = require('../models/ImageProduct')

const connection = new Sequelize(dbConfig);

User.init(connection);
Address.init(connection);
Stores.init(connection);
Product.init(connection);
ImagesProducts.init(connection);

User.associate(connection.models);
Address.associate(connection.models);
Stores.associate(connection.models);
Product.associate(connection.models);
ImagesProducts.associate(connection.models);

module.exports = connection;
