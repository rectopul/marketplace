const { Model, DataTypes } = require("sequelize");

class CategoryMap extends Model {
    static init(sequelize) {
        super.init({}, { sequelize });
    }

    static associate(models) {
        //category_id
        this.belongsTo(models.Categories, {
            foreignKey: 'category_id',
            as: 'categories_map'
        })
        this.belongsTo(models.Product, {
            foreignKey: "user_id",
            as: "product_categories_map"
        });
        this.belongsTo(models.Product, {
            foreignKey: "store_id",
            as: "store_categories_map"
        });
        this.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "user_categories_map"
        });
    }
}

module.exports = CategoryMap;
