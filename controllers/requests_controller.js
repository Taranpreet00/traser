const FriendRequest = require('../models/friend_request');
const Friendship = require('../models/friendships');
const User = require('../models/user');

exports.fetchRequests = async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        .populate({
            path: 'friend_requests',
            populate: {
                path: 'from_user to_user'
            }
        });

        const all_users = await User.find();

        return res.render('requests_page', {
            title: "Friend Requests",
            user: user,
            all_users: all_users
        });
    }
    catch(err){
        console.log('Error in fetching requests', err);
        return res.redirect('back');
    }
}

exports.newRequest = async (req, res) => {
    try{
        if(req.user.id == req.params.id){
            req.flash('error', 'You cannot send friend request to yourself!');
            return res.redirect('back')
        }
        let friendRequest = await FriendRequest.findOne({from_user: req.user.id, to_user: req.params.id});
        let friendRequest1 = await FriendRequest.findOne({from_user: req.params.id, to_user: req.user.id});
        let friendship1 = await Friendship.findOne({from_user: req.user.id, to_user: req.params.id});
        let friendship2 = await Friendship.findOne({from_user: req.params.id, to_user: req.user.id});
        if(friendRequest){
            req.flash('error', 'Friend request already sent');
            return res.redirect('back');
        }
        else if(friendship1 || friendship2){
            req.flash('error', 'You are already friend with the user');
            req.redirect('back');
        }
        else if(friendRequest1){
            req.flash('error', 'The user sent you friend request, you can confirm it');
            return res.redirect('/requests/fetch');
        }
        else{
            let newFriendRequest = await FriendRequest.create({
                from_user: req.user.id,
                to_user: req.params.id
            });
            let toUser = await User.findById(req.params.id);
            toUser.friend_requests.push(newFriendRequest);
            toUser.save();
            req.flash('success', 'Friend request sent successfully');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in making requests', err);
        return res.redirect('back');
    }
}

exports.confirmRequest = async (req, res) => {
    try{
        let currentrequest = await FriendRequest.findById(req.params.id);
        if(!currentrequest){
            req.flash('error', `request doesn't exist`);
            return res.redirect('back');
        }
        if(req.user.id != currentrequest.to_user){
            req.flash('error', 'You are not authorised');
            res.redirect('back');
        }
        let from_user = await User.findById(currentrequest.from_user);
        let to_user = await User.findById(currentrequest.to_user);
        let newFriendship = await Friendship.create({
            from_user: from_user,
            to_user: to_user
        })
        from_user.friendships.push(newFriendship);
        to_user.friendships.push(newFriendship);
        to_user.friend_requests.pull(currentrequest);
        from_user.save();
        to_user.save();
        currentrequest.remove();
        req.flash('success', `You are now friends with ${from_user.name}`);
        return res.redirect('back');
    }
    catch(err){
        console.log('Error in confirming request', err);
        return res.redirect('back');
    }
}

exports.destroyRequest = async (req, res) => {
    try{
        let currentRequest = await FriendRequest.findById(req.params.id);
        if(!currentRequest){
            req.flash('error', `Friend Requets doesn't exist`);
            return res.redirect('back');
        }
        else if(currentRequest.to_user.toString() != req.user.id){
            req.flash('error', 'Unauthorised');
            return res.redirect('back');
        }
        let user = await User.findById(req.user);
        user.friend_requests.pull(currentRequest);
        user.save();
        currentRequest.remove();

        req.flash('success', 'Request deleted successfully');
        return res.redirect('back');
    }
    catch(err){
        console.log('Error in deleting request', err);
        return res.redirect('back');
    }
}

exports.removeFriend = async (req, res) => {
    try{
        const this_friendship = await Friendship.findOne({
            $or: [
                {from_user: req.user, to_user: req.params.id},
                {from_user: req.params.id, to_user: req.user}
            ]
        });
        if(this_friendship){
            const curr_user = await User.findById(req.user);
            const friend_user = await User.findById(req.params.id);
            curr_user.friendships.pull(this_friendship);
            curr_user.save();
            friend_user.friendships.pull(this_friendship);
            friend_user.save();
            this_friendship.remove();
            req.flash('success', 'Friend Removed Successfully');
            return res.redirect('back');
        }
        
        req.flash('error', 'You are not friends with the user');
        return res.redirect('back');
    }
    catch(err){
        console.log('Error in deleting request', err);
        return res.redirect('back');
    }
}

exports.cancelRequest = async (req, res) => {
    try{
        let currentRequest = await FriendRequest.findOne({
            from_user: req.user,
            to_user: req.params.id
        });
        if(!currentRequest){
            req.flash('error', `Friend Requets doesn't exist`);
            return res.redirect('back');
        }
        let user = await User.findById(req.params.id);
        user.friend_requests.pull(currentRequest);
        user.save();
        currentRequest.remove();

        req.flash('success', 'Request canceled');
        return res.redirect('back');
    }
    catch(err){
        console.log('Error in canceling request', err);
        return res.redirect('back');
    }
}