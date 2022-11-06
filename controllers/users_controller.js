const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    });
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     })
    // }
    // else{
    //     req.flash('error', 'UnAuthorized')
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('***** Multer error : ', err);}
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(error){
            req.flash('error', err);
            return req.redirect('back');
        }
    }
    else{
        req.flash('error', 'UnAuthorized')
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