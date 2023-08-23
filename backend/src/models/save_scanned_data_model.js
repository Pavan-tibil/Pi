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
    extracted_data: {
        type: Object,
        required: false,
        trim: true
    },
    image:{
        type:String
    }
});

const Hello = mongoose.model('results', todoSchema, 'results');

module.exports = Hello;
