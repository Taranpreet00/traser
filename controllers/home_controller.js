const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){
    
    // Post.find({},function(err, posts){
    //     console.log(posts);
    //     return res.render('home', {
    //         title: "Home",
    //         posts: posts
    //     });
    // })

    Post.find().populate('user').exec(function(err, posts){
        if(err){console.log(err); return;}
        return res.render('home', {
            title: "Home",
            posts: posts
        })
    })
    
}