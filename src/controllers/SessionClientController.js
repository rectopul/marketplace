const Client = require('../models/Client');

class SessionClientController {
	async store(req, res) {
		const { email, password } = req.body;

		if ('string' != typeof password) {
			return res.status(401).json({ message: 'pleade pass password in string format' });
		}


		const client = await Client.findOne({ where: { email } });
		//console.log(user);
		if (!client) {
			return res.status(401).json({ message: 'Client not found' });
		}

		const clientpass = await client.checkPassword(password).catch(err => {
			console.log(err);
		})

		if (!clientpass) {
			return res.status(401).json({ message: 'incorrect Password' });
		}

		return res.json({
			client,
			token: client.generateToken(),
		});
	}
}

module.exports = new SessionClientController();
