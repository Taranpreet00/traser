const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true
});

const ResetToken = mongoose.model('ResetToken', resetSchema);
module.exports = ResetToken;