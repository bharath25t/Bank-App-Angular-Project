const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bank', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Mongoose schema for user data
const userSchema = new mongoose.Schema({
  acno: { type: String, required: true, unique: true },
  uname: { type: String, required: true },
  psw: { type: String, required: true },
  balance: { type: Number, default: 0 },
  transactions: { type: Array, default: [] }
});

// Mongoose models for register and login collections
const Register = mongoose.model('Register', userSchema, 'register');
const Login = mongoose.model('Login', userSchema, 'login');

// Registration API
app.post('/register', async (req, res) => {
  const { acno, uname, psw } = req.body;

  const userExists = await Register.findOne({ acno });
  if (userExists) {
    return res.status(400).json({ message: 'Account number already exists' });
  }

  const newUser = new Register({ acno, uname, psw });
  try {
    await newUser.save();
    const newLoginUser = new Login({ acno, uname, psw });
    await newLoginUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { acno, psw } = req.body;

  try {
    const user = await Login.findOne({ acno, psw });
    if (!user) {
      return res.status(401).json({ message: 'Invalid account number or password' });
    }

    const token = jwt.sign({ acno: user.acno }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({
      currentUser: user.uname,
      currentAcno: user.acno,
      token,
      message: 'Login successful'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Deposit API
app.post('/deposit', async (req, res) => {
  const { acno, psw, amnt } = req.body;

  try {
    const user = await Register.findOne({ acno, psw });
    if (!user) {
      return res.status(401).json({ message: 'Invalid account number or password' });
    }

    user.balance += Number(amnt);
    user.transactions.push({ type: 'Deposit', amount: amnt, date: new Date() });
    await user.save();

    res.json({ message: 'Deposit successful', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Withdraw API
app.post('/withdrew', async (req, res) => {
  const { acno, psw, amnt } = req.body;

  try {
    const user = await Register.findOne({ acno, psw });
    if (!user) {
      return res.status(401).json({ message: 'Invalid account number or password' });
    }

    if (user.balance < Number(amnt)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= Number(amnt);
    user.transactions.push({ type: 'Withdraw', amount: amnt, date: new Date() });
    await user.save();

    res.json({ message: 'Withdrawal successful', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Transaction API
app.post('/getTransaction', async (req, res) => {
  const { acno } = req.body;

  try {
    const user = await Register.findOne({ acno });
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({ transactions: user.transactions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Account API
app.delete('/deleteacc/:acno', async (req, res) => {
  const { acno } = req.params;

  try {
    const registerResult = await Register.deleteOne({ acno });
    const loginResult = await Login.deleteOne({ acno });

    if (registerResult.deletedCount === 0) {
      return res.status(404).json({ message: 'Account not found in register collection' });
    }
    if (loginResult.deletedCount === 0) {
      return res.status(404).json({ message: 'Account not found in login collection' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
