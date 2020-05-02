const { DataTypes, Model } = require('sequelize')

class OrderDelivery extends Model {
    static init(sequelize) {
        super.init(
            {
                service: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The service field cannot be empty`,
                        },
                    },
                },
                service_code: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The service_code field cannot be empty`,
                        },
                    },
                },
                code: DataTypes.STRING,
                delivery_time: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `The delivery_time field must be a integer number`,
                        },
                        notEmpty: {
                            msg: `The delivery_time field cannot be empty`,
                        },
                    },
                },
                delivery_date: {
                    type: DataTypes.DATE,
                    validate: {
                        isDate: {
                            msg: `The delivery_time field must be a date`,
                        },
                        notEmpty: {
                            msg: `The delivery_time field cannot be empty`,
                        },
                    },
                },
                value: {
                    type: DataTypes.DECIMAL,
                    validate: {
                        isDecimal: {
                            msg: `The value field must be a decimal number`,
                        },
                        notEmpty: {
                            msg: `The value field cannot be empty`,
                        },
                    },
                },
                status: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The status field cannot be empty`,
                        },
                    },
                },
            },
            { sequelize }
        )
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'store' })
        this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' })
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
        this.belongsTo(models.DeliveryAddress, { foreignKey: 'delivery_id', as: 'delivery' })
    }
}

module.exports = OrderDelivery
