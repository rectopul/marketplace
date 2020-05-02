const { Model, DataTypes } = require('sequelize')

class DeliveryAddress extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The name field cannot be empty`,
                        },
                    },
                },
                cpf: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The cpf field cannot be empty`,
                        },
                        is: {
                            args: /([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})/g,
                            msg: `This field must be a phone`,
                        },
                    },
                },
                address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The address field cannot be empty`,
                        },
                    },
                },
                zipcode: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The zipcode field cannot be empty`,
                        },
                    },
                },
                city: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The city field cannot be empty`,
                        },
                    },
                },
                state: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The state field cannot be empty`,
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
