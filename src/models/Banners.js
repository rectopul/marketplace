const { Model, DataTypes } = require("sequelize");

class Banners extends Model {
    static init(sequelize) {
        super.init(
            {
                title: DataTypes.TEXT,
                description: DataTypes.TEXT,
                position: DataTypes.TEXT,
                image_id: DataTypes.INTEGER
            },
            {
                sequelize
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
    }
}

module.exports = Banners;