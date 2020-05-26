const { Model, DataTypes } = require('sequelize')

class Variation extends Model {
    static init(sequelize) {
        super.init(
            {
                attribute_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                attribute_value: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                variation_menu_order: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`,
                        },
                    },
                },
                upload_image_id: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`,
                        },
                    },
                },
                variable_enabled: DataTypes.STRING,
                variable_description: DataTypes.STRING,
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'store' })
        this.belongsTo(models.Image, { foreignKey: 'upload_image_id', as: 'image' })
        this.hasMany(models.VariablesMap, {
            foreignKey: 'variation_id',
            as: 'productVariation',
        })
        this.hasMany(models.CartProduct, {
            foreignKey: `product_id`,
            as: `cartProduct`,
        })
    }
}

module.exports = Variation
