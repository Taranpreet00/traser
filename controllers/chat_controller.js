const User = require('../models/user');
const Chat = require('../models/chat');
const Friendship = require('../models/friendships');
const Message = require('../models/message');

exports.deleteMessage = async function(req, res){
    let currentMessage = await Message.findById(req.params.id);
    if(!currentMessage){
        return res.status(401).json({
            message: 'Message doesnot exist'
        });
    }
    if(req.user.id != currentMessage.from_user.toString()){
        return res.status(401).json({
            message: 'Unauthorised'
        });
    }
    let currentchat = await Chat.findOneAndUpdate({
        $or: [
            {user1: currentMessage.from_user, user2: currentMessage.to_user}, 
            {user2: currentMessage.from_user, user1: currentMessage.to_user}
        ] ,
    }, {
        $pull: {messages: req.params.id}
    });
    currentMessage.remove();
    return res.status(200).json({
        message: 'Message Deleted'
    });
}

exports.newMessage = async function(req, res){
    console.log(req.body);
    const user2 = await User.findById(req.body.to_user_id);
    
    if(!user2){
        return res.status(401).json({
            message: 'User doesnot exist'
        });
    }
    const user_friend = await Friendship.findOne({
        $or: [
            {from_user: req.user, to_user: req.body.to_user_id}, 
            {to_user: req.user, from_user: req.body.to_user_id}
        ] ,
    });
    if(!user_friend){
        return res.status(401).json({
            message: 'Unauthorised'
        });
    }
    let newmessage = await Message.create({
        content: req.body.message,
        from_user: req.user.id,
        to_user: user2.id
    });
    let chat = await Chat.findOne({
        $or: [
            {user1: req.user, user2: user2}, 
            {user2: req.user, user1: user2}
        ] ,
    });
    chat.messages.push(newmessage);
    chat.save();
    return res.status(200).json({
        message: newmessage
    });
}

exports.fetch = async function(req, res){
    const user = await User.findById(req.user.id)
    .populate({
        path: 'friendships',
        populate: 'from_user to_user'
    });
    return res.render('chat_page', {
        title: "Chat Page",
        user: user
    });
}

exports.fetchChat = async function(req, res){
    let chat = await Chat.findOne({
        $or: [
            {user1: req.user, user2: req.body.toUser}, 
            {user2: req.user, user1: req.body.toUser}
        ] ,
    })
    .populate('user1', 'id name email')
    .populate('user2', 'id name email')
    .populate({
        path: 'messages'
    });
    const user2 = await User.findById(req.body.toUser);
    const user_friend = await Friendship.findOne({
        $or: [
            {from_user: req.user, to_user: req.body.toUser}, 
            {to_user: req.user, from_user: req.body.toUser}
        ] ,
    });
    if(!user2 || !user_friend){
        return res.status(401).json({
            message: 'unauthorised'
        });
    }

    if(!chat){
        chat = await Chat.create({
            user1: req.user,
            user2: user2
        });
    }
    return res.status(200).json({
        data: {
            message: "Done",
            chat: chat,
            receiveuser: {
                name: user2.name,
                id: user2.id
            }
        }
    });
}