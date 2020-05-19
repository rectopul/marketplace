const { DataTypes, Model } = require('sequelize')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Client extends Model {
    static init(sequelize) {
        super.init(
            {
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This email already exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        isEmail: {
                            msg: `This field must be an email`,
                        },
                    },
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This name already exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The name field cannot be empty`,
                        },
                    },
                },
                surname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The surname field cannot be empty`,
                        },
                    },
                },
                birthDate: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The birthDate not empty`,
                        },
                    },
                },
                cpf: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The birthDate not empty`,
                        },
                        len: {
                            args: [11, 11],
                            msg: `cpf String length is not in this range`,
                        },
                    },
                },
                countryCode: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The countryCode not empty`,
                        },
                        len: {
                            args: [2, 2],
                            msg: `countryCode String length is not in this range`,
                        },
                    },
                },
                phoneNumber: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The phoneNumber not empty`,
                        },
                        len: {
                            args: [13, 15],
                            msg: `phoneNumber String length is not in this range`,
                        },
                    },
                },
                street: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The street not empty`,
                        },
                    },
                },
                streetNumber: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The streetNumber not empty`,
                        },
                    },
                },
                complement: {
                    type: DataTypes.STRING,
                },
                district: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The district not empty`,
                        },
                    },
                },
                city: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The city not empty`,
                        },
                    },
                },
                state: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The birthDate not empty`,
                        },
                        len: {
                            args: [2, 2],
                            msg: `state String length is not in this range`,
                        },
                    },
                },
                country: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The birthDate not empty`,
                        },
                        len: {
                            args: [3, 3],
                            msg: `Country String length is not in this range`,
                        },
                    },
                },
                zipCode: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The birthDate not empty`,
                        },
                    },
                },
                password: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        notEmpty: {
                            msg: `Tthe password field cannot be empty`,
                        },
                    },
                },
                password_hash: DataTypes.STRING,
                active: {
                    type: DataTypes.BOOLEAN,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                passwordResetToken: DataTypes.STRING,
                passwordResetExpires: DataTypes.DATE,
                wireId: {
                    type: DataTypes.STRING,
                    unique: {
                        msg: `This Wirecard ID already exist`,
                    },
                },
                ownId: {
                    type: DataTypes.STRING,
                    unique: {
                        msg: `The own_id ID already exist`,
                    },
                },
            },
            {
                hooks: {
                    beforeSave: async (client) => {
                        if (client.password) {
                            client.password_hash = await bcrypt.hash(client.password, 8)
                        }
                    },
                },
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Image, { foreignKey: 'image_id', as: 'image' })
        this.hasMany(models.DeliveryAddress, { foreignKey: 'client_id', as: 'delivery_addresses' })
        this.hasMany(models.CartProduct, { foreignKey: `product_id`, as: `cartProduct` })
        this.hasMany(models.Cart, { foreignKey: `client_id`, as: `cart` })
        this.hasMany(models.ProductsOrder, { foreignKey: 'client_id', as: 'order_map' })
        this.hasMany(models.Order, { foreignKey: 'client_id', as: 'order' })
        this.hasMany(models.ClientCard, { foreignKey: 'client_id', as: 'cards' })
    }
}

Client.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash)
}

Client.prototype.generateToken = function () {
    return jwt.sign({ id: this.id, name: this.name }, process.env.APP_SECRET_CLIENT)
}

module.exports = Client
