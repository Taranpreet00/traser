const express = require('express');
const app = express();
//require cookies
const cookieParser = require('cookie-parser');
const port = 8000;
//require express layouts
const expressLoyouts = require('express-ejs-layouts');
//acquire database
const db = require('./config/mongoose');

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

//use express router
app.use('/', require('./routes'));

//setting template engine and views path
app.set('view engine', 'ejs');
app.set('views', './views');

//setting app to listen at port
app.listen(port, function(err){
    if(err){
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server is running on port : ${port}`);
})