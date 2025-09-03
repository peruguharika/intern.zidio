const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (change <your-connection-string>)
mongoose.connect("mongodb+srv://charan:charan123@cluster0.keyoqyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


// Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const historySchema = new mongoose.Schema({
  userId: String,
  fileName: String,
  chartType: String,
  xAxis: String,
  yAxis: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const History = mongoose.model("History", historySchema);

// Routes
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) res.json({ success: true, userId: user._id });
  else res.json({ success: false });
});

app.post("/history", async (req, res) => {
  const history = new History(req.body);
  await history.save();
  res.json({ message: "History saved" });
});

app.get("/history/:userId", async (req, res) => {
  const data = await History.find({ userId: req.params.userId });
  res.json(data);
});

// Start server
app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
