const { DataTypes, Model } = require('sequelize');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
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
				password: {
					type: DataTypes.VIRTUAL,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
				type: {
					type: DataTypes.STRING,
					validate: {
						notEmpty: {
							msg: `This field cannot be empty`
						}
					}
				},
				password_hash: DataTypes.STRING,
				passwordResetToken: DataTypes.STRING,
				passwordResetExpires: DataTypes.DATE
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
		this.hasMany(models.CategoryMap, { foreignKey: 'user_id', as: 'user_categories_map', });
		this.hasMany(models.VariablesMap, { foreignKey: 'product_id', as: 'variablemap', });
		this.belongsTo(models.Stores, { foreignKey: 'store_id', as: 'managers', })
	}
}

User.prototype.checkPassword = function (password) {
	return bcrypt.compare(password, this.password_hash);
};

User.prototype.generateToken = function () {
	return jwt.sign({ id: this.id, name: this.name }, process.env.APP_SECRET, { expiresIn: '24h' });
};

module.exports = User;