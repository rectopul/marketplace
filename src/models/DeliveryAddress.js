const { Model, DataTypes } = require("sequelize");

class DeliveryAddress extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                cpf: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        },
                        is: {
                            args: /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/g,
                            msg: `This field must be a phone`
                        }
                    }
                },
                address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                zipcode: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                city: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                state: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                active: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
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
        this.belongsTo(models.Client, { foreignKey: "client_id", as: "client" });
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'store', });
    }
}

module.exports = DeliveryAddress;
