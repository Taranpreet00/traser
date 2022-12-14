const User = require('../models/user');
const Token = require('../models/reset-token');
const fs = require('fs');
const path = require('path');
const resetOTPMailer = require('../mailers/reset-mailer');
const crypto = require('crypto');
const TempUser = require('../models/temp_user');
const verifyMailer = require('../mailers/verify_user_mailer');
const Friendship = require('../models/friendships');
const Friendrequest = require('../models/friend_request');

module.exports.profile = async function(req, res){
    try{
        const user = await User.findById(req.params.id);
        if(req.params.id != req.user.id){
            const user_friend = await Friendship.findOne({
                $or: [
                    {from_user: req.user, to_user: req.params.id}, 
                    {to_user: req.user, from_user: req.params.id}
                ] ,
            });
            const requests = await Friendrequest.findOne({
                from_user: req.user,
                to_user: req.params.id
            });
            let friends = false;
            if(user_friend){
                friends = true;
            }
            let request = false;
            if(requests){
                request = true;
            }
            return res.render('user_profile', {
                title: "User Profile",
                profile_user: user,
                friends: friends,
                request_sent: request
            });
        }
        
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    }
    catch(err){
        console.log('Error ', err);
        return res.redirect('back');
    }
    
}

module.exports.updateProfilePage = function(req, res){
    return res.render('user_profile_update', {
        title: "Profile Update",
    });
}

module.exports.updateProfile = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('***** Multer error : ', err);}
                user.name = req.body.name;

                if(req.file){
                    if(user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('/users/profile/'+req.params.id);
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

module.exports.updatePasswordPage = function(req, res){
    return res.render('user_password_update', {
        title: "Password Update",
    });
}

module.exports.updatePassword = function(req, res){
    if(req.body.current_password != req.user.password){
        req.flash('error', 'Wrong Password');
        return res.redirect('back');
    }
    if(req.body.new_password != req.body.confirm_password){
        req.flash('error', 'Passwords donot match');
        return res.redirect('back');
    }
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log('Error in fetching user ', err);
            return res.redirect('back');
        }
        user.password = req.body.new_password;
        user.save();
        req.flash('success', 'Password Changed Successfully');
        res.redirect('/');
    });
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

module.exports.create = async function(req, res){
    
    if(req.body.password != req.body.confirm_password)
        return res.redirect('back');
    try{
        let user = await User.findOne({email: req.body.email});

        if(!user){
            let verifyToken = crypto.randomBytes(8).toString('hex');
            let newTempUser = await TempUser.create({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                token: verifyToken
            });
            verifyMailer.verifymail(newTempUser);
            setTimeout(() => {
                newTempUser.remove();
            }, 300000);
            return res.redirect('/users/verify_page');
        }
        else{
            req.flash('error', 'User already exist');
            return res.redirect('back');
        }
    }
    catch(error){
        console.log('error', error);
        return res.redirect('back');
    }
}

exports.verifyPage = (req, res) => {
    if(req.isAuthenticated()){
        let id = req.user.id;
        console.log('request is authenticated')
        return res.redirect('/users/profile/'+id);
    }
    return res.render('verify_user', {
        title: "Verify User"
    });
}

exports.verify = async (req, res) => {
    try{
        let NewUser = await TempUser.findOne({token: req.body.token});
        if(!NewUser){
            req.flash('error', 'Invalid OTP');
            return res.redirect('/users/signup');
        }
        await User.create({
            email: NewUser.email,
            password: NewUser.password,
            name: NewUser.name
        });
        NewUser.remove();
        req.flash('success', 'Account Created Successfully');
        return res.redirect('/users/signin');
    }
    catch(error){
        req.flash('error', err);
        return req.redirect('back');
    }
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
        setTimeout(function(){
            newtoken.remove();
        }, 300000);
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