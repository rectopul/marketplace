const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { promisify } = require("util");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const { email } = req.body

    var decoded

    if (!authHeader) {
        return res.status(401).send({ error: "No token provided 13" });
    }

    const [, token] = authHeader.split(" ");


    try {
        decoded = jwt.verify(token, process.env.APP_SECRET)
    } catch (e) {
        return res.status(401).send({ error: 'unauthorized' });
    }

    var id = decoded.id;

    // Fetch the user by id 
    const userToken = await User.findOne({ where: { id } })

    if (!userToken) {
        return res.status(401).json({ message: 'User from token not found' })
    }

    if (`super` != userToken.type)
        return res.status(401).json({ message: 'current user does not have credentials to create new users' })



    next()
}
