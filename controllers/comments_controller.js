const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            }); 
            post.comments.push(comment);
            post.save();
            return res.redirect('/');
        }
    }
    catch(err){
        console.log('Error', err);
        return;
    }
}

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
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
            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}})
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error', err);
        return;
    }
}