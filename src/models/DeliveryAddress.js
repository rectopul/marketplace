const { Model, DataTypes } = require("sequelize");

class DeliveryAddress extends Model {
    static init(sequelize) {
        super.init(
            {
                name: DataTypes.STRING,
                cpf: DataTypes.STRING,
                address: DataTypes.STRING,
                zipcode: DataTypes.STRING,
                city: DataTypes.STRING,
                state: DataTypes.STRING,
                active: DataTypes.STRING

            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Client, { foreignKey: "client_id", as: "client" });
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'store', });
    }
}

module.exports = DeliveryAddress;
