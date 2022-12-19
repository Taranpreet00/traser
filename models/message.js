const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;