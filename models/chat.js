const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
},{
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;