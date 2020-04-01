const { Model, DataTypes } = require("sequelize");

class ProductsOrder extends Model {
    static init(sequelize) {
        super.init({ quantity: DataTypes.INTEGER }, { sequelize });
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
        this.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
        this.belongsTo(models.Client, { foreignKey: "client_id", as: "client" });
        this.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
        this.belongsTo(models.VariablesMap, { foreignKey: "variation_id", as: "variation" });
    }
}

module.exports = ProductsOrder;
