const User = require('../models/user');

module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: "User Profile"
    })
}

module.exports.signup = function(req, res){
    return res.render('user_sign_up',{
        title: "Signup"
    });
}

module.exports.signin = function(req, res){
    return res.render('user_sign_in', {
        title: "Signin"
    })
}

module.exports.createSession = function(req, res){
    return res.end("<h1> Signin request Successfully submitted</h1>");
}

module.exports.create = function(req, res){
    
    if(req.body.password != req.body.confirm_password)
        return res.redirect('back');
    User.findOne({email: req.body.email}, function(err, user){
        if(err) {console.log('error in finding user in signing up'); return}

        if(!user){
            User.create(req.body, function(err, user){
                if(err) {console.log('error in creating user while signing up'); return}

                return res.redirect('/users/signin')
            })
        }
        else{
            return res.redirect('back');
        }
    });
}