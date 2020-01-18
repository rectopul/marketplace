<<<<<<< HEAD
const bcrypt = require("bcryptjs");

const User = require("../../src/models/User");

const truncate = require("../utils/truncate");

describe("User", () => {
    beforeEach(async () => {
        await truncate();
    });

    it("should encrypt user password", async () => {
        const user = await User.create({
            client_id: "123123123",
            name: "Rogério Bonfim",
            email: "rogeriomateus@icloud.com",
            password: "123456",
            auth: "sidadhaiosdhakjhdasiofdhakjlfhdalskjfh",
            credentials: "super"
        });

        const compareHash = await bcrypt.compare("123456", user.password_hash);
        expect(compareHash).toBe(true);
    });
});
=======
const bcrypt = require('bcryptjs');

const User = require('../../src/models/User');

const truncate = require('../utils/truncate');

describe('User', () => {
	beforeEach(async () => {
		await truncate();
	});

	it('should encrypt user password', async () => {
		const user = await factory.create('User', {
			password: '123456',
		});

		const compareHash = await bcrypt.compare('123456', user.password_hash);
		expect(compareHash).toBe(true);
	});
});
>>>>>>> cca3b28560c3e2d78053e2667f0c9560bfd5a64b
