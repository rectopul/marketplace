const { Model, DataTypes } = require("sequelize");

class Stores extends Model {
    static init(sequelize) {
        super.init(
            {
                name: DataTypes.STRING,
                email: DataTypes.STRING,
                phone: DataTypes.STRING,
                cell: DataTypes.STRING,
                url: DataTypes.STRING,
                zipcode: DataTypes.STRING,
                state: DataTypes.STRING,
                city: DataTypes.STRING,
                street: DataTypes.TEXT,
                number: DataTypes.INTEGER
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        this.hasMany(models.Product, { foreignKey: 'store_id', as: 'products', });
        this.hasMany(models.Categories, { foreignKey: 'store_id', as: 'categories', });
        this.hasMany(models.CategoryMap, { foreignKey: 'store_id', as: 'store_categories_map', })
        this.hasMany(models.Variation, { foreignKey: 'variable_store_id', as: 'variable', });
        this.hasMany(models.VariablesMap, { foreignKey: 'product_id', as: 'variablemap', });
    }
}

module.exports = Stores;