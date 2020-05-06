const { Model, DataTypes } = require('sequelize')

class DeliveryAddress extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The name field is required`,
                        },
                        notEmpty: {
                            msg: `The name field cannot be empty`,
                        },
                    },
                },
                cpf: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The cpf field is required`,
                        },
                        notEmpty: {
                            msg: `The cpf field cannot be empty`,
                        },
                        is: {
                            args: /([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})/g,
                            msg: `This field must be a cpf`,
                        },
                    },
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The cpf field is required`,
                        },
                        notEmpty: {
                            msg: `The phone field cannot be empty`,
                        },
                        is: {
                            args: /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g,
                            msg: `This field must be a phone`,
                        },
                    },
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The street field is required`,
                        },
                        notEmpty: {
                            msg: `The street field cannot be empty`,
                        },
                    },
                },
                number: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The number field is required`,
                        },
                        isInt: {
                            msg: `The number field must be of the integer type`,
                        },
                        notEmpty: {
                            msg: `The number field cannot be empty`,
                        },
                    },
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The address field is required`,
                        },
                        notEmpty: {
                            msg: `The address field cannot be empty`,
                        },
                    },
                },
                zipcode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The zipcode field is required`,
                        },
                        notEmpty: {
                            msg: `The zipcode field cannot be empty`,
                        },
                    },
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The city field is required`,
                        },
                        notEmpty: {
                            msg: `The city field cannot be empty`,
                        },
                    },
                },
                state: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The state field is required`,
                        },
                        notEmpty: {
                            msg: `The state field cannot be empty`,
                        },
                    },
                },
                receiver_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The receiver_name field is required`,
                        },
                        notEmpty: {
                            msg: `The receiver_name field cannot be empty`,
                        },
                    },
                },
                address_type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The address_type field is required`,
                        },
                        notEmpty: {
                            msg: `The address_type field cannot be empty`,
                        },
                    },
                },
                additional_information: DataTypes.STRING,
                delivery_instructions: DataTypes.STRING,
                delivery_number: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `The delivery_number field must be of the integer type`,
                        },
                    },
                },
                active: DataTypes.BOOLEAN,
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    }
}

module.exports = DeliveryAddress
