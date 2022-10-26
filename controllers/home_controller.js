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

    Post.find()
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        if(err){console.log(err); return;}
        User.find({}, function(err ,user){
            return res.render('home', {
                title: "Home",
                posts: posts,
                all_users: user
            })
        })
    })
    
}