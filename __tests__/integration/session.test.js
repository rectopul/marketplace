const request = require("supertest");

const app = require("../../src/app");

const User = require("../../src/models/User");
const truncate = require("../utils/truncate");

describe("Authentication", () => {
    beforeEach(async () => {
        await truncate();
    });

    it("should authenticate with valid credentials", async () => {
        const user = await User.create({
            client_id: "123123123",
            name: "Rogério Bonfim",
            email: "rogeriomateus@icloud.com",
            password: "123123",
            auth: "sidadhaiosdhakjhdasiofdhakjlfhdalskjfh",
            credentials: "super"
        });

        const response = await request(app)
            .post("/sessions")
            .send({
                email: user.email,
                password: "123456"
            });

        expect(response.status).toBe(200);
    });
});
