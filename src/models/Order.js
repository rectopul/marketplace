const { DataTypes, Model } = require('sequelize');

class Order extends Model {
    static init(sequelize) {
        super.init({ status: DataTypes.STRING }, { sequelize, });
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    }
}

module.exports = Order;