const { Model, DataTypes } = require("sequelize");

class Variation extends Model {
    static init(sequelize) {
        super.init(
            {
                attribute_name: DataTypes.STRING,
                attribute_value: DataTypes.STRING,
                variation_menu_order: DataTypes.INTEGER,
                upload_image_id: DataTypes.INTEGER,
                variable_sku: DataTypes.STRING,
                variable_enabled: DataTypes.STRING,
                variable_regular_price: DataTypes.STRING,
                variable_sale_price: DataTypes.STRING,
                variable_sale_price_dates_from: DataTypes.STRING,
                variable_sale_price_dates_to: DataTypes.STRING,
                variable_stock: DataTypes.INTEGER,
                variable_original_stock: DataTypes.INTEGER,
                variable_stock_status: DataTypes.STRING,
                variable_weight: DataTypes.STRING,
                variable_length: DataTypes.STRING,
                variable_width: DataTypes.STRING,
                variable_height: DataTypes.STRING,
                variable_shipping_class: DataTypes.STRING,
                variable_description: DataTypes.STRING
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "variable_store_id", as: "store" });
        this.hasMany(models.VariablesMap, { foreignKey: 'variation_id', as: 'variablemap', });
    }
}

module.exports = Variation;
