const path = require('path')
const nodemailer = require('nodemailer')
let aws = require('aws-sdk')
const hbs = require('nodemailer-express-handlebars')

aws.config.update({ region: process.env.AWS_DEFAULT_REGION })

// create Nodemailer SES transporter
const gmail = {
    host: `smtp.gmail.com`,
    port: 587,
    auth: {
        user: `mateusrectopul@gmail.com`,
        pass: `308554970B`,
    },
}

/* {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
}
 */
var transport = nodemailer.createTransport(gmail)

transport.use(
    'compile',
    hbs({
        viewEngine: {
            extName: '.html',
            partialsDir: path.resolve('./src/resources/mail/'),
            layoutsDir: path.resolve('./src/resources/mail/'),
            defaultLayout: 'auth/forgot_password.html',
        },
        viewPath: path.resolve('./src/resources/mail/'),
        extName: '.html',
    })
)

module.exports = transport
