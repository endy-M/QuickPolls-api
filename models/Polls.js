const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        required: true,
    },
});

const QuestionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    options: [OptionSchema],
});

const PollSchema = new mongoose.Schema({
    pollid: {
        type: String,
        required: true,
    },
    questions: [QuestionSchema],
});

const PollModel = mongoose.model("polls", PollSchema);
module.exports = PollModel;
