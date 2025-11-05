const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());

mongodb_url=process.env.MONGO_URL;

mongoose.connect(mongodb_url)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err))


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  batch: { type: String, required: true },
  points: { type: Number, default: 0 }
});


const submissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: String,
  sem: { type: Number, required: true },
  category : { type: String, required: true },
  point : { type: Number, required: true },
  proof: { type: String, required: true },
  batch: { type: String },
  studentId : { type: String },
  date: { type: Date, default: Date.now },
  status: String,
});

const Submission = mongoose.model('Submission', submissionSchema);
const User = mongoose.model('User', userSchema);

app.get("/home/viewSubmissions/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userBatch = user.batch;
    const submissions = await Submission.find({ batch: userBatch, studentId: username });

    res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Error logging out" });
    }

    res.clearCookie("connect.sid"); // clear session cookie
    return res.status(200).json({ message: "Logged out successfully" });
  });
});

app.get('/getuserdata/:user', (req, res) => {
  const username = req.params.user;

  User.findOne({ username }) // findOne for a single user
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user); // send user data
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    });
});

//server listening
app.listen(3000, ()=>{
  console.log("listening at http://localhost:3000")
})