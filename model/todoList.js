const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('TodoList',todoTaskSchema);