const { DataTypes, Model } = require('sequelize');

class Cart extends Model {
    static init(sequelize) {
        super.init(
            {
                active: {
                    type: DataTypes.BOOLEAN,
                    validate: {
                        notEmpty: {
                            msg: `This field cannot be empty`
                        }
                    }
                }
            },
            {
                sequelize,
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
        this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'stores' });
        this.hasMany(models.CartProduct, { foreignKey: `cart_id`, as: `cartProducts` })
    }
}

module.exports = Cart;