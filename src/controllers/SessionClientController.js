const Client = require('../models/Client');
const axios = require('axios')

class SessionClientController {
	async store(req, res) {
		try {

			const { email, password } = req.body;

			if ('string' != typeof password) {
				return res.status(401).json({ message: 'pleade pass password in string format' });
			}


			const client = await Client.findOne({
				where: { email },
				attributes: [`name`, `email`, `active`]
			})

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

	async fbLogin(req, res) {
		try {

			const { accessToken } = req.body

			//console.log(`informações: `, req.body);

			//Get infos user
			const user = await axios.get(`https://graph.facebook.com/v6.0/me?access_token=${accessToken}&fields=name%2Cemail&method=get&pretty=0&sdk=joey&suppress_http_code=1`)

			const { data: response } = user

			if (response.error)
				return res.status(401).send({ error: response.error })

			console.log(`Informações do usuario: `, response)

			const { name, email } = response

			//check if user exist
			const client = await Client.findOne({
				where: { email },
				attributes: [`name`, `email`, `active`]
			})

			if (!client || client.active != true)
				return res.status(401).json({ message: 'Client not found' });

			return res.json({
				client,
				token: client.generateToken(),
			})
			//if exist return token en logging

			//else sign-up and loggin & send token
		} catch (error) {
			console.log(`Erro ao fazer login com facebook: `, error)
			return res.status(400).send(error)
		}
	}

	async instaLogin(req, res) {

	}
}

module.exports = new SessionClientController();
