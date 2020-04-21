const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Client = require('../models/Client')


module.exports = async (authHeader, store_id) => {
    return new Promise(async (resolve, reject) => {
        let decoded

        const [, token] = authHeader.split(" ");

        if (!token)
            return reject("No token provided 8")

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET_CLIENT)
        } catch (e) {
            return reject("unauthorized")
        }

        const id = decoded.id;

        // Fetch the user by id 
        const UserExist = await Client.findByPk(id)

        if (!UserExist) {
            return reject("User informed by token not exists")
        } else {

            if (UserExist.active != true)
                return reject("Client is disabled")

            resolve(id)
        }

    })
};
