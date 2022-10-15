const express = require('express');
const app = express();
//require cookies
const cookieParser = require('cookie-parser');
const port = 8000;
//require express layouts
const expressLoyouts = require('express-ejs-layouts');
//acquire database
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');

//use body parser
app.use(express.urlencoded());
//use cookie as middleware
app.use(cookieParser());
//set static files
app.use(express.static('./assets'));

//set up layouts
app.use(expressLoyouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//setting template engine and views path
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'traser',
    //To Do change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost:27017/traser_development',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongo setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router
app.use('/', require('./routes'));

//setting app to listen at port
app.listen(port, function(err){
    if(err){
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server is running on port : ${port}`);
})