const User = require('../models/user');
const Token = require('../models/reset-token');
const fs = require('fs');
const path = require('path');
const resetOTPMailer = require('../mailers/reset-mailer');
const crypto = require('crypto');

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
                // updating email error because the email could already exist, check required
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

exports.forgetPassword = (req, res) => {
    if(req.isAuthenticated()){
        let id = req.user.id;
        console.log('request is authenticated')
        return res.redirect('/users/profile/'+id);
    }
    return res.render('forget_password', {
        title: "Forget-password"
    });
}

exports.createToken = async (req, res) => {
    let user = await User.findOne({email: req.body.email});
    
    if(!user){
        req.flash('error', 'User Doesnot exist, Please signup');
        return res.redirect('/users/signup');
    }
    else{
        let resetToken = crypto.randomBytes(8).toString('hex');
        let newtoken = await Token.create({
            user: user,
            token: resetToken,
            isValid: true
        });
        newtoken = await newtoken.populate('user', 'name email');
        resetOTPMailer.resetToken(newtoken);
        req.flash('success', 'Otp Sent to your mail Successfully');
        return res.redirect('/users/reset_password_page');
    }
}

exports.resetPasswordPage = (req, res) => {
    if(req.isAuthenticated()){
        let id = req.user.id;
        console.log('request is authenticated')
        return res.redirect('/users/profile/'+id);
    }
    return res.render('reset_password', {
        title: "Reset-password"
    });
}

exports.resetPassword = async (req, res) => {
    let currtoken = await Token.findOne({token: req.body.token});
    if(!currtoken){
        req.flash('error', 'OTP invalid');
        return res.redirect('back');
    }
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords not match');
        return res.redirect('back');
    }
    if(!currtoken.isValid){
        req.flash('error', 'OTP expired');
        return res.redirect('/users/signin');
    }
    let curruser = await User.findById(currtoken.user);
    curruser.password = req.body.password;
    curruser.save();
    currtoken.isValid = false;
    currtoken.save();
    req.flash('success', 'Password Changed Successfully');
    return res.redirect('/users/signin');
}