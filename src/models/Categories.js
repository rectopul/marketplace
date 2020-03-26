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
                    }
                },
                description: DataTypes.TEXT,
                parent: DataTypes.STRING,
                slug: DataTypes.STRING,
                characteristics: DataTypes.STRING,
                address: DataTypes.STRING
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: "store_id", as: "categories" });
        this.hasMany(models.CategoryMap, { foreignKey: 'category_id', as: 'categories_map', });
    }
}

module.exports = Categories;
