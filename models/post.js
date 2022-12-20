const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const PICTURE_PATH = path.join('/uploads/posts/images');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    picture: {
        type: String
    },
    //include the array of id's of all comments in this post schema itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps : true
});

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '..' , PICTURE_PATH));
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now());
    }
});

postSchema.statics.uploadedPicture = multer({storage: storage}).single('picture');
postSchema.statics.picturePath = PICTURE_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;