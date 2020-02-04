const { Model, DataTypes } = require("sequelize");

class Variation extends Model {
    static init(sequelize) {
        super.init(
            {
                name: DataTypes.STRING,
                options: DataTypes.STRING
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
    }
}

module.exports = Variation;
