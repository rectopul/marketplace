const { DataTypes, Model } = require('sequelize');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: DataTypes.STRING,
				email: DataTypes.STRING,
				password: DataTypes.VIRTUAL,
				password_hash: DataTypes.STRING,
				type: DataTypes.STRING,
			},
			{
				hooks: {
					beforeSave: async user => {
						if (user.password) {
							user.password_hash = await bcrypt.hash(user.password, 8);
						}
					},
				},
				sequelize,
			},
		);
	}

	static associate(models) {
		this.hasMany(models.Address, { foreignKey: 'user_id', as: 'addresses' });
		this.hasMany(models.Stores, { foreignKey: 'user_id', as: 'stores' });
	}
}

User.prototype.checkPassword = function(password) {
	return bcrypt.compare(password, this.password_hash);
};

User.prototype.generateToken = function() {
	return jwt.sign({ id: this.id }, process.env.APP_SECRET);
};

module.exports = User;