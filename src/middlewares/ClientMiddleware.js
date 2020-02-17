const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Client = require('../models/Client')


module.exports = async (token, store_id) => {
    return new Promise(async (resolve, reject) => {
        let decoded

        if (!token)
            reject(Error("No token provided"))

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            reject(Error("unauthorized"))
        }

        const id = decoded.id;

        // Fetch the user by id 
        const UserExist = await Client.findByPk(id)

        if (!UserExist) {
            reject(Error("User informed by token not exists"))
        } else {
            resolve(id)
        }

    })
};
