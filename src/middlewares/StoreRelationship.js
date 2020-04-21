const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Store = require('../models/Stores')

const authConfig = "";

module.exports = async (req, store_id) => {
    return new Promise(async (resolve, reject) => {
        const authHeader = req.headers.authorization
        let decoded

        if (!authHeader)
            reject(Error("No token provided 11"))

        const [, token] = authHeader.split(" ");

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            reject(Error("unauthorized"))
        }

        const id = decoded.id;

        // Fetch the user by id 
        const StoreFromUser = await Store.findOne({ where: { "user_id": id } })

        if (!StoreFromUser) {
            reject(Error("This store does not belong to the informed user"))
        } else {
            resolve(StoreFromUser)
        }

    })
};
