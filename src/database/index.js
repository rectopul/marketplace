const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Address = require("../models/Address");
const Stores = require('../models/Stores')

const connection = new Sequelize(dbConfig);

User.init(connection);
Address.init(connection);
Stores.init(connection);

User.associate(connection.models);
Address.associate(connection.models);
Stores.associate(connection.models);

module.exports = connection;
