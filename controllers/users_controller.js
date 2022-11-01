const User = require('../models/user');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    });
}

module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            return res.redirect('back');
        })
    }
    else{
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signup = function(req, res){
    if(req.isAuthenticated()){
        let id = req.user.id;
        return res.redirect('/users/profile/' + id);
    }
    return res.render('user_sign_up',{
        title: "Signup"
    });
}

module.exports.signin = function(req, res){
    if(req.isAuthenticated()){
        let id = req.user.id;
        console.log('request is authenticated')
        return res.redirect('/users/profile/'+id);
    }
    return res.render('user_sign_in', {
        title: "Signin"
    })
}

module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
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

module.exports.destroySession = function(req, res){
    req.logout(function(err){
        if(err) {return next(err);}
        req.flash('success', 'Logged Out Successfully');
        res.redirect('/');
    });
}