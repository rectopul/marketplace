const { Model, DataTypes } = require("sequelize");

class Banners extends Model {
    static init(sequelize) {
        super.init(
            {
                title: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                },
                description: DataTypes.TEXT,
                position: DataTypes.TEXT,
                image_id: {
                    type: DataTypes.INTEGER,
                    validate: {
                        isInt: {
                            msg: `This field must be a integer value`
                        }
                    }
                }
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