<<<<<<< HEAD
const { DataTypes, Model } = require("sequelize");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password_hash);
};

User.prototype.generateToken = function() {
    return jwt.sign({ id: this.id }, process.env.APP_SECRET);
};

module.exports = User;
=======
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
		this.hasMany(models.Address, {
			foreignKey: 'user_id',
			as: 'addresses',
		});
	}
}

User.prototype.checkPassword = function(password) {
	return bcrypt.compare(password, this.password_hash);
};

User.prototype.generateToken = function() {
	return jwt.sign({ id: this.id }, process.env.APP_SECRET);
};

module.exports = User;
>>>>>>> cca3b28560c3e2d78053e2667f0c9560bfd5a64b
