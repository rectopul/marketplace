const { Model, DataTypes } = require("sequelize");

class Coupon extends Model {
    static init(sequelize) {
        super.init(
            {
                code: {
                    type: DataTypes.STRING,
                    unique: {
                        msg: `there is already a coupon with this code`
                    },
                    validate: {
                        notEmpty: {
                            msg: `The code field cannot be empty`
                        },
                    }
                },
                value: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        notEmpty: {
                            msg: `The value field cannot be empty`
                        }
                    }
                },
                valid_from: DataTypes.DATE,
                valid_to: DataTypes.DATE,
                active: {
                    type: DataTypes.BOOLEAN,
                    validate: {
                        notEmpty: {
                            msg: `The active field cannot be empty`
                        },
                        isBoolean(val) {
                            if (typeof val != `boolean`)
                                throw new Error(`This field must have a boolean value`)
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
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client', });
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'store', });
    }
}

module.exports = Coupon;
