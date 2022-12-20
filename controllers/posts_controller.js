const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
const fs = require('fs');
const path = require('path');

module.exports.create = async function(req, res){
    try{
        await Post.uploadedPicture(req, res, async function(err){
            if(err){console.log('***** Multer error : ', err);}
            let post;
            if(req.file){
                console.log('it contains picture');
                post = await Post.create({
                    content: req.body.content,
                    user: req.user._id,
                    picture: Post.picturePath + '/' + req.file.filename
                });
            }
            else{
                console.log('it doesnot contain picture');
                post = await Post.create({
                    content: req.body.content,
                    user: req.user._id
                }); 
            }
            let user = await User.findById(post.user);
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post: post,
                        user_name: user.name
                    },
                    message: 'Post created!'
                })
            }

            req.flash('success', 'Post Published!');
            return res.redirect('back');
        });
    }
    catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        // .id means converting the object id into string
        if(post.user == req.user.id){
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            // await Like.deleteMany({_id: {$in: post.comments}});
            if(post.picture && fs.existsSync(path.join(__dirname, '..', post.picture))){
                fs.unlinkSync(path.join(__dirname, '..', post.picture));
            }
            for(let comment of post.comments){
                await Like.deleteMany({likeable: comment, onModel: 'Comment'});
            }
            post.remove();
            
            
            await Comment.deleteMany({post: req.params.id});
            

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'Post and Associated Comments deleted!'
                });
            }

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            res.redirect('back');
        }
    }
    catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}