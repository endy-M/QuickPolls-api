const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PollModel = require("./models/Polls");

const dotenv = require('dotenv');
dotenv.config();
const apiKey = process.env.REACT_APP_API_KEY;

const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(apiKey);

app.get("https://quickpolls-api.onrender.com/getPolls/:id", (req, res) => {
    let id = req.params.id;
    PollModel.findOne({ pollid: id })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error('Error:', err);
            res.status(404).json({ error: "Poll not found" });
        });
});

app.post("https://quickpolls-api.onrender.com/createPoll", async (req, res) => {
    const poll = req.body;
    const newPoll = new PollModel(poll)
    await newPoll.save();
    res.json(poll);
})

app.post('https://quickpolls-api.onrender.com/submitPoll', async (req, res) => {
    const { pollid, selectedOptions } = req.body;
  
    try {
      const poll = await PollModel.findOne({ pollid });
  
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
  
      // Update votes for selected options
      selectedOptions.forEach((optionIndex, questionIndex) => {
        poll.questions[questionIndex].options[optionIndex].votes += 1;
      });
  
      // Save the updated poll
      await poll.save();
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error submitting poll:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
