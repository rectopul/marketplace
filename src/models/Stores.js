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

    static assocstores(models) {
        this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
}

module.exports = Stores;