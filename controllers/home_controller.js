const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    
    // Post.find({},function(err, posts){
    //     console.log(posts);
    //     return res.render('home', {
    //         title: "Home",
    //         posts: posts
    //     });
    // })

    try{
        let posts = await Post.find()
        .sort('-createdAt')
        .populate('user likes')
        .populate({
            path: 'comments',
            populate: {
                path: 'user likes'
            }
        });

        let users = await User.find();
        
        if(req.isAuthenticated()){
            const user = await User.findById(req.user.id)
            .populate({
                path: 'friendships',
                populate: 'from_user to_user'
            });
            return res.render('home', {
                title: "Home",
                posts: posts,
                all_users: users,
                user: user
            });
        }

        return res.render('home', {
            title: "Home",
            posts: posts,
            all_users: users
        });
    }
    catch(err){
        console.log('Error', err);
        return;
    }
}