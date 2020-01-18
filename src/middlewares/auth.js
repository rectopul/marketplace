const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const authConfig = "";

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: "No token provided" });

    const [, token] = authHeader.split(" ");

    try {
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.APP_SECRET
        );

        req.userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).send({ error: "Token invalid" });
    }

    return next();
};
