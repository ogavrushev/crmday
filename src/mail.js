const mailer = require('nodemailer');

const transport = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'oleg@sipuni.com',
        pass: 'personal2007!'
    }
});

module.exports = function (to, data) {
    const mailOptions = {
        from: 'oleg@sipuni.com',
        to,
        subject: 'Новая заявка от crmday.sipuni.com',
        html: `
            Имя - ${data.name} <br/>
            Телефон - ${data.phone} <br/>
            Email - ${data.email} <br/>
        `
    };

    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, function (err, info)  {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        })
    });
};