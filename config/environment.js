const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'traser_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'taranpreetsingh308@gmail.com',
            pass: 'ptuaxweeceqaswkx'
        }
    },
    google_client_id: '134112350201-2nefc1ubuvg2uffrj0vcf43cifk2kc2t.apps.googleusercontent.com',
    google_client_secret: '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',
    google_callback_url: 'http://localhost:8000/users/auth/google/callback',
    jwt_secret: 'traser',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }

}

const production = {
    name: 'production',
    asset_path: process.env.TRASER_ASSET_PATH,
    session_cookie_key: process.env.TRASER_SESSION_COOKIE_KEY,
    db: process.env.TRASER_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.TRASER_GMAIL_USERNAME,
            pass: process.env.TRASER_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.TRASER_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.TRASER_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.TRASER_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.TRASER_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}
// module.exports = production;

module.exports = eval(process.env.NODE_ENV) == undefined? development : eval(process.env.NODE_ENV);