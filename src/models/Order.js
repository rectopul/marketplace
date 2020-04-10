const { DataTypes, Model } = require('sequelize');

class Order extends Model {
    static init(sequelize) {
        super.init({
            status: DataTypes.STRING,
            total: DataTypes.DECIMAL
        }, { sequelize, });
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
        this.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' })
        this.hasMany(models.ProductsOrder, { foreignKey: 'order_id', as: 'products_order' })
    }
}

module.exports = Order;