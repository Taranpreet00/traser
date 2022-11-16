const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const kue = require('kue');
const Like = require('../models/like')

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
            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in creating a queue ',err);
                    return;
                }
                // console.log('job enqueued' , job.id);
            })
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: 'Comment added!'
                });
            }
            req.flash('success', 'Comment added!');
            return res.redirect('/');
        }
    }
    catch(err){
        req.flash('error', err);
        return res.redirect('back');
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
            await Like.deleteMany({likeable: comment, onModel: 'Comment'});
            comment.remove();
            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: 'Comment removed!'
                });
            }
            req.flash('success', 'Comment removed!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'You cannot delete this comment');
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}