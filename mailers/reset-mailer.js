const nodemailer = require('../config/nodemailer');

exports.resetToken = (token) => {
    let htmlString = nodemailer.renderTemplate({token: token}, '/reset_password.ejs');
    nodemailer.transporter.sendMail({
        from: 'Traser@<taranpreetsingh308>',
        to: token.user.email,
        subject: "OTP for password reset @ Traser",
        html: htmlString,

    },(err, info) => {
        if(err){console.log('Error in sending mail', err); return}
        console.log('Message sent', info);
        return;
    });
}