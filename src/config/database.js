module.exports = {
    dialect: "postgres",
    host: "localhost",
    username: "insta",
    password: "1234",
    database: "insta",
    options: {
        port: 5432
    },
    define: {
        timestamps: true,
        underscored: true
    }
};
