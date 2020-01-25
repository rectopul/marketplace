const { Model, DataTypes } = require("sequelize");

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                zipcode: DataTypes.STRING,
                state: DataTypes.STRING,
                city: DataTypes.STRING,
                street: DataTypes.STRING,
                number: DataTypes.INTEGER
            },
            {
                sequelize
            }
        );
    }

    static prodassociate(models) {
        this.belongsTo(models.User, { foreignKey: "store_id", as: "stores" });
    }
}

module.exports = Product;
