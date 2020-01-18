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

    /* const parts = authHeader.split(" ");

    if (!parts.length == 2)
        return res.status(401).send({ error: "Token error" });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "Token malformated" });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: "Token invalid" });

        //req.user
    }); */
};
