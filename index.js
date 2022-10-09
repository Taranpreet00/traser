const express = require('express');
const app = express();
const port = 8000;
const expressLoyouts = require('express-ejs-layouts');

app.use(express.static('./assets'));

app.use(expressLoyouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use express router
app.use('/', require('./routes'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server is running on port : ${port}`);
})