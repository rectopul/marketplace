<<<<<<< HEAD
require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    database = {
        dialect: process.env.DB_DIALECT || "postgres",
        host: "ec2-174-129-253-175.compute-1.amazonaws.com",
        username: "rvrxmvewbbncnc",
        password:
            "cb8750ed6e48b289d51972764d4939cf7f248b52684560a13d49feace9b9ba7c",
        database: "dagec71e23cc8b",
        storage: "./__tests__/database.sqlite",
        logging: true, //false
        options: {
            port: 5432
        },
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true
        }
    };
} else {
    // the application is executed on the local machine ... use mysql
    database = {
        dialect: process.env.DB_DIALECT || "postgres",
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        storage: "./__tests__/database.sqlite",
        logging: false,
        options: {
            port: 5432
        },
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true
        }
    };
}

module.exports = database;
=======
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
>>>>>>> cca3b28560c3e2d78053e2667f0c9560bfd5a64b
