const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    answers: {
        type: [{
            answer: {
                type: String,
                required: true,
                trim: true
            },
            answeredBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            answeredOn: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    }
}, {
    timestamps: true,
});

const Discussion = mongoose.model('Discussion', discussionSchema);
module.exports = Discussion;