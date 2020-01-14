const { DataTypes, Model } = require("sequelize");

const bcrypt = require("bcryptjs");

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                client_id: DataTypes.STRING,
                name: DataTypes.STRING,
                email: DataTypes.STRING,
                password: DataTypes.VIRTUAL,
                password_hash: DataTypes.STRING,
                auth: DataTypes.STRING,
                credentials: DataTypes.STRING
            },
            {
                hooks: {
                    beforeSave: async (user) => {
                        if (user.password) {
                            user.password_hash = await bcrypt.hash(
                                user.password,
                                8
                            );
                        }
                    }
                },
                sequelize
            }
        );
    }

    static associate(models) {
        this.hasMany(models.Address, {
            foreignKey: "user_id",
            as: "addresses"
        });
    }
}

module.exports = User;
