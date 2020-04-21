const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { promisify } = require("util")
const Manager = require('../models/Manager')

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const { email } = req.body

    var decoded

    if (!authHeader) {
        return res.status(401).send({ error: "No token provided 10" });
    }

    const [, token] = authHeader.split(" ");


    try {
        decoded = jwt.verify(token, process.env.APP_SECRET)
    } catch (e) {
        return res.status(401).send({ error: 'unauthorized' });
    }

    const { id, name } = decoded

    const manager = await Manager.findOne({ where: { id, name } })

    if (manager)
        return next()

    // Fetch the user by id 
    const userToken = await User.findOne({ where: { id } })

    if (!userToken) {
        return res.status(401).json({ message: 'User from token not found' })
    }

    if (userToken.type == `super`)
        return next()

    if (`storeAdministrator` != userToken.type)
        return res.status(401).json({ message: 'current user does not have credentials to create new users' })

    return next()
}
