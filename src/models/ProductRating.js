const { Model, DataTypes } = require("sequelize");

class ProductRating extends Model {
    static init(sequelize) {
        super.init(
            {

                rate: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: `The field Rate not valid empty value`
                        }
                    }
                },
                comment: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The field Comment not valid empty value`
                        }
                    }
                }
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
        this.belongsTo(models.Client, { foreignKey: "client_id", as: "client" });
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
    }
}

module.exports = ProductRating;
