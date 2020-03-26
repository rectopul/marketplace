const { DataTypes, Model } = require('sequelize');

class CartProduct extends Model {
    static init(sequelize) { super.init({}, { sequelize, }); }

    static associate(models) {
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'stores' });
        this.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
    }
}

module.exports = CartProduct;