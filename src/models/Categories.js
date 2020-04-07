const { Model, DataTypes } = require("sequelize");

class Categories extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    },
                    unique: {
                        msg: `This Name already in use!`
                    }
                },
                description: DataTypes.TEXT,
                parent: DataTypes.STRING,
                slug: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `Slug field cannot be empty`
                        }
                    },
                    unique: {
                        msg: `This slug already in use!`
                    }
                },
                characteristics: DataTypes.STRING,
                address: {
                    type: DataTypes.STRING,
                    unique: {
                        msg: `This address informed already exist"`
                    }
                }
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
        this.hasMany(models.CategoryMap, { foreignKey: 'category_id', as: 'products_category', });
    }
}

module.exports = Categories;
