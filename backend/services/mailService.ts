
const nodemailer = require('nodemailer');


class MailService{
    transporter: any;

    constructor(){
       this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
       });
    }

    sendMail(username: string, to: string, link: string){
        this.transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to,
            subject: `Активация аккаунта на ${process.env.SITE_URL}`,
            html: `
                <div>
                    <h1>Уважаемый, ${username}</h1>
                    <p>Для завершения авторизации перейдите по ссылке</p>
                    <a href="${link}">Завершить авторизацию</a>
                </div>
            `
        });
    }
}

export default new MailService();