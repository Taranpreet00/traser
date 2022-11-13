const nodemailer = require('../config/nodemailer');

exports.verifymail = (tempUser) => {
    let htmlString = nodemailer.renderTemplate({user: tempUser}, '/verify_email.ejs');
    nodemailer.transporter.sendMail({
        from: 'Traser@<taranpreetsingh308>',
        to: tempUser.email,
        subject: "OTP for new account verify reset @ Traser",
        html: htmlString,

    },(err, info) => {
        if(err){console.log('Error in sending mail', err); return}
        return;
    });
}