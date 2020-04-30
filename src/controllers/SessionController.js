const User = require('../models/User')
const Manager = require('../models/Manager')

class SessionController {
    async store(req, res) {
        try {
            const { email, password } = req.body

            //Managers
            const manager = await Manager.findOne({
                where: { email },
            })

            if (manager) {
                if (!(await manager.checkPassword(password))) {
                    return res.status(401).json({ message: 'incorrect Password' })
                }

                const managerJson = user.toJSON()

                delete managerJson.password_hash

                return res.json({
                    manager,
                    token: manager.generateToken(),
                })
            }

            //super and administrator
            const user = await User.findOne({ where: { email } })

            //console.log(user);
            if (!user) {
                return res.status(401).json({ message: 'User not found' })
            }

            if (!(await user.checkPassword(password))) {
                return res.status(401).json({ message: 'incorrect Password' })
            }

            const userjson = user.toJSON()

            delete userjson.password_hash
            delete userjson.passwordResetToken
            delete userjson.passwordResetExpires

            return res.json({
                userjson,
                token: user.generateToken(),
            })
        } catch (error) {
            console.log(`Erro de sessão: `, error)
        }
    }
}

module.exports = new SessionController()
