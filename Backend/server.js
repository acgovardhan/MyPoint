const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",                  // local dev
  "https://my-point.vercel.app",            // your actual Vercel URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(express.json());

const mongodb_url = process.env.MONGO_URL;

mongoose.connect(mongodb_url)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("DB connection error:", err));


// ─── Schemas ────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },   // stored as bcrypt hash
  role:     { type: String, required: true },
  batch:    { type: String, required: true },
  points:   { type: Number, default: 0 }
});

const submissionSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  desc:      String,
  sem:       { type: Number, required: true },
  category:  { type: String, required: true },
  point:     { type: Number, required: true },
  proof:     { type: String, required: true },
  batch:     { type: String },
  studentId: { type: String },
  date:      { type: Date, default: Date.now },
  status:    String,
});

const Submission = mongoose.model('Submission', submissionSchema);
const User       = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "MyPoint API is running" });
});
// ─── Auth Routes ─────────────────────────────────────────────────────────────

// Registration
app.post("/registration", async (req, res) => {
  const { name, email, username, password, role, branch, yearOfPassout } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists. Please choose another." });
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const currUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      batch: `${branch}${yearOfPassout}`,
    });

    await currUser.save();

    const redirectTo = role === "Student" ? "/home" : "/admin/home";

    return res.status(201).json({
      message: "Registration successful!",
      redirectTo,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      message: "Server error during registration.",
      error: err.message,
    });
  }
});


// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const redirectTo = user.role === "Student" ? "/home" : "/admin/home";

    return res.status(200).json({
      message: "Login successful",
      redirectTo,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error during login.",
      error: err.message,
    });
  }
});


// Logout (localStorage-based auth — just a confirmation endpoint)
app.get("/logout", (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
});


// ─── User Routes ──────────────────────────────────────────────────────────────

// Get user data by username
app.get('/getuserdata/:user', async (req, res) => {
  const username = req.params.user;
  try {
    const user = await User.findOne({ username }).select("-password"); // never expose hash
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ─── Submission Routes ────────────────────────────────────────────────────────

// Student: view own submissions
app.get("/home/viewSubmissions/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const submissions = await Submission.find({ batch: user.batch, studentId: username });
    res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Student: submit an activity
app.post("/activity_sub", async (req, res) => {
  try {
    const { title, desc, sem, category, point, proof, username, batch } = req.body;

    if (!username || !batch) {
      return res.status(400).json({ message: "User info missing. Please log in again." });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found. Please log in again." });

    const currSub = new Submission({
      title,
      desc,
      sem,
      category,
      point,
      proof,
      status: "pending",
      batch,
      studentId: username,
    });

    await currSub.save();
    res.status(201).json({ message: "Activity submitted successfully!" });
  } catch (err) {
    console.error("Error saving submission:", err);
    res.status(500).json({ message: "Server error while saving submission", error: err.message });
  }
});


// Admin: view all pending submissions for their batch
app.get("/home/allSubmissions/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const admin = await User.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const submissions = await Submission.find({ batch: admin.batch, status: "pending" });
    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Admin: approve or reject a submission
app.post("/submissions/updateStatus", async (req, res) => {
  const { id, status, point } = req.body;
  try {
    const submission = await Submission.findById(id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    submission.status = status;
    await submission.save();

    if (status === "approved") {
      const user = await User.findOne({ username: submission.studentId });
      if (user) {
        user.points = (user.points || 0) + Number(point);
        await user.save();
      }
    }

    return res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating submission:", err);
    return res.status(500).json({ message: "Error updating submission", error: err.message });
  }
});


// Admin: get all students and their points for their batch
app.get("/admin/batchPoints/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const admin = await User.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const students = await User.find({ batch: admin.batch }).select("name username email points batch");
    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching batch points:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Notifications (students + admins)
app.get("/notifications/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    let notifications = [];

    if (user.role === "Admin") {
      notifications = await Submission.find({ batch: user.batch, status: "pending" }).sort({ date: -1 });
    } else if (user.role === "Student") {
      notifications = await Submission.find({ studentId: username }).sort({ date: -1 });
    }

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
