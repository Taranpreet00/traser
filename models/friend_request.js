const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
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

const friendRequest = mongoose.model('Friendrequest', friendRequestSchema);
module.exports = friendRequest;