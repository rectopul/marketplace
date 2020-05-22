const { DataTypes, Model } = require('sequelize')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                email: {
                    type: DataTypes.STRING,
                    unique: {
                        msg: `This email of user aready exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The email field cannot be empty`,
                        },
                        isEmail: {
                            msg: `Enter a valid email`,
                        },
                    },
                },
                password: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                type: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                password_hash: DataTypes.STRING,
                passwordResetToken: DataTypes.STRING,
                passwordResetExpires: DataTypes.DATE,
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This phone of store aready exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The phone field cannot be empty`,
                        },
                        is: {
                            args: /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g,
                            msg: `Please provide a valid phone number`,
                        },
                    },
                },
                cell: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This cell of store aready exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The cell field cannot be empty`,
                        },
                        is: {
                            args: /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/g,
                            msg: `Please provide a valid cell number`,
                        },
                    },
                },
            },
            {
                hooks: {
                    beforeSave: async (user) => {
                        if (user.password) {
                            user.password_hash = await bcrypt.hash(user.password, 8)
                        }
                    },
                },
                sequelize,
            }
        )
    }

    static associate(models) {
        this.hasMany(models.Address, { foreignKey: 'user_id', as: 'addresses' })
        this.hasMany(models.MelhorEnvio, { foreignKey: 'user_id', as: 'melhorEnvio' })
        this.hasMany(models.Stores, { foreignKey: 'user_id', as: 'stores' })
        this.hasMany(models.CategoryMap, { foreignKey: 'user_id', as: 'user_categories_map' })
        this.hasMany(models.VariablesMap, { foreignKey: 'product_id', as: 'variablemap' })
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'managers' })
    }
}

User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash)
}

User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id, name: this.name }, process.env.APP_SECRET)
}

module.exports = User
