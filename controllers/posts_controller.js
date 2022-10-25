const Post = require('../models/post');
const Comment = require('../models/comment');

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

module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err || !post){
            return res.redirect('back');
        }
        // .id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();
            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            });
        }else{
            res.redirect('back');
        }
    });
}