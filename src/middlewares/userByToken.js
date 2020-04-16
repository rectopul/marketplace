const jwt = require("jsonwebtoken");
const User = require('../models/User')
const Client = require('../models/Client')


module.exports = async (authHeader, store_id) => {
    return new Promise(async (resolve, reject) => {
        let decoded

        const [, token] = authHeader.split(" ");

        if (!token)
            reject("No token provided")

        try {
            decoded = jwt.verify(token, process.env.APP_SECRET)
        } catch (error) {
            return reject(error)
        }

        const { id, name } = decoded;

        //Check clients table
        const client = await Client.findOne({ where: { id, name } })

        if (client)
            return resolve({ client_id: client.id })

        // Fetch the user by id 
        const UserExist = await User.findOne({ where: { id, name } })

        if (!UserExist)
            return reject("User informed by token not exists")
        else
            return resolve({ user_id: UserExist.id })
    })
};
