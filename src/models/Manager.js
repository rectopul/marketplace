const { DataTypes, Model } = require('sequelize');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Manager extends Model {
    static init(sequelize) {
        super.init(
            {
                store_id: DataTypes.INTEGER,
                email: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        },
                        isEmail: {
                            msg: `This field must be an email`
                        },
                    },
                    unique: {
                        msg: 'Email address already in use!'
                    }
                },
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The name field cannot be empty`
                        }
                    }
                },
                phone: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The phone field cannot be empty`
                        },
                        is: {
                            args: /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/g,
                            msg: `This field must be a phone`
                        }
                    }
                },
                cell: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The cell field cannot be empty`
                        },
                        is: {
                            args: /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/g,
                            msg: `The cell field must be a cell`
                        }
                    }
                },
                password: {
                    type: DataTypes.VIRTUAL,
                    validate: {
                        notEmpty: {
                            msg: `The password field cannot be empty`
                        }
                    }
                },
                password_hash: DataTypes.STRING,
                cpf: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The cpf field cannot be empty`
                        },
                        is: {
                            args: /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/g,
                            msg: `The cpf field must be a phone`
                        }
                    }
                },
                address: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The address field cannot be empty`
                        }
                    }
                },
                zipcode: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The zipcode field cannot be empty`
                        },
                        isInt: {
                            msg: `The zipcode field must be a number`
                        }
                    }
                },
                city: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The city field cannot be empty`
                        }
                    }
                },
                state: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The state field cannot be empty`
                        }
                    }
                }
            },
            {
                hooks: {
                    beforeSave: async manager => {
                        if (manager.password) {
                            manager.password_hash = await bcrypt.hash(manager.password, 8);
                        }
                    },
                },
                sequelize,
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" })
    }
}

Manager.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
};

Manager.prototype.generateToken = function () {
    return jwt.sign({ id: this.id, name: this.name }, process.env.APP_SECRET_CLIENT);
};

module.exports = Manager;