const { DataTypes, Model } = require('sequelize');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Client extends Model {
	static init(sequelize) {
		super.init(
			{
				store_id: DataTypes.INTEGER,
				email: {
					type: DataTypes.STRING,
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
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
				phone: {
					type: DataTypes.STRING,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						},
						is: {
							args: /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/g,
							msg: `This field must be a phone`
						}
					}
				},
				cell: {
					type: DataTypes.STRING,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						},
						is: {
							args: /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/g,
							msg: `This field must be a cell`
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
				cpf: {
					type: DataTypes.STRING,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						},
						is: {
							args: /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/g,
							msg: `This field must be a phone`
						}
					}
				},
				address: {
					type: DataTypes.STRING,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
				zipcode: {
					type: DataTypes.STRING,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						},
						isInt: {
							msg: `This field must be a number`
						}
					}
				},
				city: {
					type: DataTypes.STRING,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
				state: {
					type: DataTypes.STRING,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
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
		this.belongsTo(models.Stores, { foreignKey: "store_id", as: "store" });
		this.hasMany(models.DeliveryAddress, { foreignKey: 'client_id', as: 'delivery' })
	}
}

Client.prototype.checkPassword = function (password) {
	return bcrypt.compare(password, this.password_hash);
};

Client.prototype.generateToken = function () {
	return jwt.sign({ id: this.id, name: this.name }, process.env.APP_SECRET, { expiresIn: '1h' });
};

module.exports = Client;