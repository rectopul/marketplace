const User = require("../models/User");

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        //console.log(user);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ message: "incorrect Password" });
        }

        return res.json({
            user,
            token: user.generateToken()
        });
    }
}

module.exports = new SessionController();
