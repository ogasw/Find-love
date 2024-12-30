const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/datingapp', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  res.json(user);
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ username: user.username, token });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Start Server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
    
