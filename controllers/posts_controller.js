const Post = require('../models/post');

module.exports.create = function(req, res){
    // if(req.isAuthenticated()){
        const curruser = req.user._id;
        Post.create({
            content: req.body.content,
            user: curruser
        }, function(err, post){
            if(err){
                console.log('Error in creating new post');
                return;
            }
            return res.redirect('/');
        });
    // }
    // else{
    //     return res.redirect('/users/signin');
    // }
}