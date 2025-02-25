const { text } = require('express');
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        text: {
            type: String,
            required: true
        }
    }],
    correctOption: {
        type: Number,
        required: true
    }
});

const answerSchema = new mongoose.Schema({
    questionIndex: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        text: questionSchema.question,
        required: true
    },
    selectedOption: {
        type: Number,
        required: true
    }
});

const attemptSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        default: -1
    },
    answers: [answerSchema],
    submittedAt: {
        type: Date,
        default: null,
        required: true
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    questions: {
        type: [questionSchema]
    },
    attempts: {
        type: [attemptSchema]
    },
    validTill: {
        type: Date,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;