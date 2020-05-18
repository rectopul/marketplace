const { DataTypes, Model } = require('sequelize')

class CartProduct extends Model {
    static init(sequelize) {
        super.init(
            {
                quantity: {
                    type: DataTypes.INTEGER,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        isInt: {
                            msg: `This field must be an integer`,
                        },
                    },
                },
            },
            { sequelize }
        )
    }

    static associate(models) {
        this.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' })
        this.belongsTo(models.VariablesMap, { foreignKey: 'variation_id', as: 'variation' })
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
    }
}

module.exports = CartProduct
