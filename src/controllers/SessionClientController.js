const Client = require('../models/Client');

class SessionClientController {
	async store(req, res) {
		try {

			const { email, password } = req.body;

			if ('string' != typeof password) {
				return res.status(401).json({ message: 'pleade pass password in string format' });
			}


			const client = await Client.findOne({ where: { email } });
			//console.log(user);
			if (!client || client.active != true)
				return res.status(401).json({ message: 'Client not found' });

			const clientpass = await client.checkPassword(password)

			if (!clientpass) {
				return res.status(401).json({ message: 'incorrect Password' });
			}

			return res.json({
				client,
				token: client.generateToken(),
			});
		} catch (error) {
			console.log(`Erro na sessão de cliente: `, error);
			return res.status(400).send({ error })
		}
	}
}

module.exports = new SessionClientController();
