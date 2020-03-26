const jwt = require("jsonwebtoken");
const User = require('../models/User')


module.exports = async (authHeader, store_id) => {
    return new Promise(async (resolve, reject) => {
        let decoded

        const [, token] = authHeader.split(" ");

        if (!token)
            reject(Error("No token provided"))

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (e) {
            reject(Error("unauthorized"))
        }

        const id = decoded.id;

        // Fetch the user by id 
        const UserExist = await User.findByPk(id)

        if (!UserExist)
            reject(Error("User informed by token not exists"))
        else
            resolve(id)
    })
};
