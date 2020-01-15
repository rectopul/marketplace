const faker = require("faker");
const { factory } = require("factory-girl");
const User = require("../src/models/User");

factory.define("User", User, {
    client_id: "123123123",
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    auth: "sidadhaiosdhakjhdasiofdhakjlfhdalskjfh",
    credentials: "super"
});

module.exports = factory;
