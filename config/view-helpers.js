const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            return filePath;
        }
        let name = filePath.slice(0,3);
        if(name == 'css'){
            return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/rev-manifest-css.json')))[filePath];
        }
        if(name == 'js/'){
            return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/rev-manifest-js.json')))[filePath];
        }
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/rev-manifest-images.json')))[filePath];
    }
}