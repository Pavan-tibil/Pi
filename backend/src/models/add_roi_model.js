const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    board_name: {
        type: String,
        required: false,
        trim: true
    },
    exam_type: {
        type: String,
        required: false,
        trim: true
    },
    stream: {
        type: String,
        required: false,
        trim: true
    },
    examination_year: {
        type: String,
        required: false,
        trim: true
    },
    boundaries: {
        type: Array,
        required: false,
        trim: true
    }
});

const Hello = mongoose.model('roi', todoSchema, 'roi');

module.exports = Hello;
