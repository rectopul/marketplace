const { DataTypes, Model } = require('sequelize');

class Order extends Model {
    static init(sequelize) {
        super.init({
            value: {
                type: DataTypes.DECIMAL,
                validate: {
                    isDecimal: {
                        msg: `The value field must be a decimal number`
                    },
                    notEmpty: {
                        msg: `The value field cannot be empty`
                    }
                }
            },
            discount: {
                type: DataTypes.DECIMAL,
                validate: {
                    isDecimal: {
                        msg: `The discount field must be a decimal number`
                    },
                    notEmpty: {
                        msg: `The discount field cannot be empty`
                    }
                }
            },
            status: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: `The status field cannot be empty`
                    }
                }
            },
            total: {
                type: DataTypes.DECIMAL,
                validate: {
                    isDecimal: {
                        msg: `The total field must be a decimal number`
                    },
                    notEmpty: {
                        msg: `The total field cannot be empty`
                    }
                }
            }
        }, { sequelize, });
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
        this.belongsTo(models.Coupon, { foreignKey: "coupon_id", as: "coupon" });
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
        this.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' })
        this.hasMany(models.ProductsOrder, { foreignKey: 'order_id', as: 'products_order' })
    }
}

module.exports = Order;