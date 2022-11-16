const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

exports.commentLike = async (req, res) => {
    try{
        const like = await Like.findOne({likeable: req.params.id, user: req.user});
        const comment = await Comment.findById(req.params.id);
        if(!like){
            let newLike = await Like.create({
                user: req.user,
                likeable: req.params.id,
                onModel: 'Comment'
            });
            comment.likes.push(newLike);
            comment.save();
            return res.json(200, {
                message: 'Comment Liked',
                deleted: false
            });
        }
        else{
            comment.likes.pull(like);
            comment.save();
            like.remove();
            return res.json(200, {
                message: 'Comment Unliked',
                deleted: true 
            });
        }
    }
    catch(err){
        console.log('Error in Comment like : ', err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

exports.postLike = async (req, res) => {
    try{
        const like = await Like.findOne({likeable: req.params.id, user: req.user});
        const post = await Post.findById(req.params.id);
        if(!like){
            let newLike = await Like.create({
                user: req.user,
                likeable: req.params.id,
                onModel: 'Post'
            });
            post.likes.push(newLike);
            post.save();
            return res.json(200, {
                message: 'Post Liked',
                deleted: false
            });
        }
        else{
            post.likes.pull(like);
            post.save();
            like.remove();
            return res.json(200, {
                message: 'Post Unliked',
                deleted: true
            });
        }
    }
    catch(err){
        console.log('Error in Post like : ', err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}