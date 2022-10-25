const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(post){
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            },function(err, comment){
                if(err){
                    console.log(err);
                    return;
                }
                post.comments.push(comment);
                post.save();
                return res.redirect('/');
            })
        }
    })
}

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        if(req.user.id == comment.user){
            // Post.findById(comment.post, function(err, post){
            //     let commentIndex = post.comments.findIndex(currcomment => currcomment == req.params.id);
            //     if(commentIndex != -1){
            //         post.comments.splice(commentIndex, 1);
            //         post.save();
            //         // contactList.splice(contactIndex, 1);
            //     }
            // });
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, function(err, post){
                return res.redirect('back');
            });
        }
        else{
            return res.redirect('back');
        }
    });
}