const { Model, DataTypes } = require('sequelize')

class Stores extends Model {
    static init(sequelize) {
        super.init(
            {
                nameStore: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This name of store aready exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The nameStore field cannot be empty`,
                        },
                    },
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The field lastName cannot be empty`,
                        },
                    },
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This email of store aready exist`,
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
                cpf: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This cpf of store aready exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The cpf field cannot be empty`,
                        },
                        is: {
                            args: /([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})/g,
                            msg: `The cpf field must be a cpf`,
                        },
                    },
                },
                rg: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This RG of store aready exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `The rg field cannot be empty`,
                        },
                    },
                },
                issuer: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The issuer field cannot be empty`,
                        },
                    },
                },
                issueDate: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The issueDate field cannot be empty`,
                        },
                    },
                },
                birthDate: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The birthDate field cannot be empty`,
                        },
                    },
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This phone of store aready exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
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
                countryCode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The countryCode field cannot be empty`,
                        },
                        isNumeric: {
                            msg: `The countryCode field must be a two number`,
                        },
                    },
                },
                url: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This url of store aready exist`,
                    },
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                        isUrl: {
                            msg: `This value must be a url`,
                        },
                    },
                },
                zipcode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                state: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                district: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The district field cannot be empty`,
                        },
                    },
                },
                number: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                country: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The country field cannot be empty`,
                        },
                        notNull: {
                            msg: `The country field cannot be empty`,
                        },
                    },
                },
                wirecardId: {
                    unique: {
                        msg: `This wirecardId of store aready exist`,
                    },
                    type: DataTypes.STRING,
                },
                acess_token: {
                    type: DataTypes.STRING,
                    unique: {
                        msg: `This acess Token already exist`,
                    },
                },
                public_key: {
                    type: DataTypes.TEXT,
                    unique: {
                        msg: `This public_key already exist`,
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
        this.hasMany(models.OrderDelivery, { foreignKey: `store_id`, as: `order_delivery` })
        this.hasMany(models.Banners, {
            foreignKey: 'store_id',
            as: 'banners',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Product, {
            foreignKey: 'store_id',
            as: 'products',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Categories, {
            foreignKey: 'store_id',
            as: 'categories',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.CategoryMap, {
            foreignKey: 'store_id',
            as: 'store_categories_map',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Variation, {
            foreignKey: 'store_id',
            as: 'variable',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.VariablesMap, {
            foreignKey: 'product_id',
            as: 'variablemap',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.CartProduct, {
            foreignKey: `product_id`,
            as: `cartProduct`,
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.User, {
            foreignKey: 'store_id',
            as: 'managers',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Order, {
            foreignKey: 'store_id',
            as: 'order',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.ProductsOrder, {
            foreignKey: 'store_id',
            as: 'order_map',
            onDelete: 'cascade',
            hooks: true,
        })
        this.hasMany(models.Shipping, {
            foreignKey: 'store_id',
            as: 'shippings',
            onDelete: 'cascade',
            hooks: true,
        })
    }
}

module.exports = Stores
