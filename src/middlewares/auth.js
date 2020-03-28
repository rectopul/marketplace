const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const authConfig = "";

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: "No token provided" });

    const [, token] = authHeader.split(" ");


    try {
        const decoded = await jwt.verify(token, process.env.APP_SECRET)

        req.userId = decoded.id;



        return next();
    } catch (err) {
        console.log(err);

        return res.status(401).send({ error: `${err} Token invalid` });
    }

    return next();
};
