const { Model, DataTypes } = require('sequelize')

class Address extends Model {
    static init(sequelize) {
        super.init(
            {
                zipcode: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                state: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                city: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                street: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                number: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.hasMany(models.Stores, { foreignKey: 'user_id', as: 'stores' })
    }
}

module.exports = Address
