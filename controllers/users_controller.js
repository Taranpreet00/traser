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

module.exports.submitSignin = function(req, res){
    return res.end("<h1> Signin request Successfully submitted</h1>");
}

module.exports.submitSignup = function(req, res){
    return res.end("<h1>Signup request Successfully Submitted</h1>");
}