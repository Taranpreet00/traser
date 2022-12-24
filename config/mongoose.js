const mongoose = require('mongoose');
const env = require('./environment');
main().catch(err => console.log(err));

//connect to the database
async function main(){
    await mongoose.connect(`mongodb://localhost:27017/${env.db}`);
}

const db = mongoose.connection;

db.once('open', function(){
    console.log('Successfully connected to the database');
})

module.exports = db;