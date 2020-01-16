require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

if (process.env.DATABASE_URL) {
	// the application is executed on Heroku ... use the postgres database
	database = {
		dialect: process.env.DB_DIALECT || 'postgres',
		host: 'ec2-23-21-13-88.compute-1.amazonaws.com',
		username: 'jtrvnyrvmjrdwp',
		password: '3705400f1f83b6da784400b7f03f314146e259da0a1efb8d2aecf6f97b5ee9bd',
		database: 'd3kocn1ecciobs',
		storage: './__tests__/database.sqlite',
		logging: true, //false
		options: {
			port: 5432,
		},
		define: {
			timestamps: true,
			underscored: true,
			underscoredAll: true,
		},
	};
} else {
	// tdefault local information databases
	database = {
		dialect: process.env.DB_DIALECT || 'postgres',
		host: process.env.DB_HOST,
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		storage: './__tests__/database.sqlite',
		logging: false,
		options: {
			port: 5432,
		},
		define: {
			timestamps: true,
			underscored: true,
			underscoredAll: true,
		},
	};
}

module.exports = database;
