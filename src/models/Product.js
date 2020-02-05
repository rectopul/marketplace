const { Model, DataTypes } = require("sequelize");

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                sku: DataTypes.STRING,
                title: DataTypes.STRING,
                description: DataTypes.STRING,
                except: DataTypes.STRING,
                stock: DataTypes.INTEGER,
                weight: DataTypes.STRING,
                width: DataTypes.STRING,
                height: DataTypes.STRING,
                length: DataTypes.STRING,
                price: DataTypes.STRING,
                promotional_price: DataTypes.STRING,
                cust_price: DataTypes.STRING,
                brand: DataTypes.STRING,
                model: DataTypes.STRING,
                frete_class: DataTypes.STRING,

            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "stores" });
        this.hasMany(models.ImagesProducts, { foreignKey: 'product_id', as: 'images_products' });
        this.hasMany(models.CategoryMap, { foreignKey: 'product_id', as: 'product_categories_map', });
        this.hasMany(models.VariablesMap, { foreignKey: 'product_id', as: 'variations', });
    }
}

module.exports = Product;
