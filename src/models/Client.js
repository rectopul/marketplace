const { DataTypes, Model } = require('sequelize');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Client extends Model {
	static init(sequelize) {
		super.init(
			{
				email: {
					type: DataTypes.STRING,
					unique: {
						msg: `This email already exist`
					},
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						},
						isEmail: {
							msg: `This field must be an email`
						}
					}
				},
				name: {
					type: DataTypes.STRING,
					unique: {
						msg: `This name already exist`
					},
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
				password: {
					type: DataTypes.VIRTUAL,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
				password_hash: DataTypes.STRING,
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
				hooks: {
					beforeSave: async client => {
						if (client.password) {
							client.password_hash = await bcrypt.hash(client.password, 8);
						}
					},
				},
				sequelize,
			},
		);
	}

	static associate(models) {
		this.hasMany(models.DeliveryAddress, { foreignKey: 'client_id', as: 'delivery_addresses' })
		this.hasMany(models.CartProduct, { foreignKey: `product_id`, as: `cartProduct` })
		this.hasMany(models.Cart, { foreignKey: `client_id`, as: `cart` })
		this.hasMany(models.ProductsOrder, { foreignKey: "client_id", as: "order_map" })
		this.hasMany(models.Order, { foreignKey: "client_id", as: "order" })
		this.belongsTo(models.Image, { foreignKey: "image_id", as: "image" })
	}
}

Client.prototype.checkPassword = function (password) {
	return bcrypt.compare(password, this.password_hash);
};

Client.prototype.generateToken = function () {
	return jwt.sign({ id: this.id, name: this.name }, process.env.APP_SECRET_CLIENT);
};

module.exports = Client;