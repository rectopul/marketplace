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
        this.belongsTo(models.Product, { foreignKey: "product_id", as: "product_variations" });
        this.belongsTo(models.Product, { foreignKey: "store_id", as: "store_variations" });
    }
}

module.exports = Variation;
