const { Model, DataTypes } = require("sequelize");

class CategoryMap extends Model {
    static init(sequelize) {
        super.init({}, { sequelize });
    }

    static associate(models) {
        //category_id
        this.belongsTo(models.Categories, { foreignKey: 'category_id', as: 'categories_map' })
        this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
        this.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
    }
}

module.exports = CategoryMap;
