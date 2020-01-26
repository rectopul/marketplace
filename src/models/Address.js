const { Model, DataTypes } = require("sequelize");

class Address extends Model {
    static init(sequelize) {
        super.init(
            {
                zipcode: DataTypes.STRING,
                state: DataTypes.STRING,
                city: DataTypes.STRING,
                street: DataTypes.STRING,
                number: DataTypes.INTEGER
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        this.hasMany(models.Stores, { foreignKey: 'user_id', as: 'stores', });
    }
}

module.exports = Address;
