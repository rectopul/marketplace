const path = require('path')
const nodemailer = require('nodemailer')
let aws = require('aws-sdk')
const hbs = require('nodemailer-express-handlebars')
const sgTransport = require('nodemailer-sendgrid-transport')

aws.config.update({ region: process.env.AWS_DEFAULT_REGION })

// create Nodemailer SES transporter
// eslint-disable-next-line no-unused-vars
/* const gmail = {
    host: `smtp.gmail.com`,
    port: 587,
    auth: {
        user: `mateusrectopul@gmail.com`,
        pass: `308554970B`,
    },
} */

/* {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
}
 */
const transport = nodemailer.createTransport(
    sgTransport({
        auth: {
            api_key: process.env.ADMIN_EMAIL_API_KEY, // your api key here, better hide it in env vars
        },
    })
)

/* var transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
}) */

transport.use(
    'compile',
    hbs({
        viewEngine: {
            extName: '.html',
            partialsDir: path.resolve('./src/resources/mail/'),
            layoutsDir: path.resolve('./src/resources/mail/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./src/resources/mail/'),
        extName: '.html',
    })
)

module.exports = transport
