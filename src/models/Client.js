const { DataTypes, Model } = require('sequelize');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Client extends Model {
	static init(sequelize) {
		super.init(
			{
				store_id: DataTypes.INTEGER,
				email: DataTypes.STRING,
				name: DataTypes.STRING,
				phone: DataTypes.STRING,
				cell: DataTypes.STRING,
				password: DataTypes.VIRTUAL,
				password_hash: DataTypes.STRING,
				cpf: DataTypes.STRING,
				address: DataTypes.STRING,
				zipcode: DataTypes.STRING,
				city: DataTypes.STRING,
				state: DataTypes.STRING,
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