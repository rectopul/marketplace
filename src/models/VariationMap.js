const { Model, DataTypes } = require("sequelize");

class VariablesMap extends Model {
    static init(sequelize) {
        super.init({}, { sequelize });
    }

    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
        this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        this.belongsTo(models.Variation, { foreignKey: "variation_id", as: "variations" });
    }
}

module.exports = VariablesMap;
