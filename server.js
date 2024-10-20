const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bank', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  acno: { type: String, required: true, unique: true }, 
  uname: { type: String, required: true },
  psw: { type: String, required: true },
  balance: { type: Number, default: 0 }, 
  transactions: { type: Array, default: [] } 
});

const User = mongoose.model('User', userSchema);

// Registration API
app.post('/register', async (req, res) => {
  const { acno, uname, psw } = req.body;

  // Check if the account number already exists
  const userExists = await User.findOne({ acno });
  if (userExists) {
    return res.status(400).json({ message: 'Account number already exists' });
  }

  // Create a new user and save to the database
  const newUser = new User({ acno, uname, psw });
  try {
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { acno, psw } = req.body;
  
  try {
    const user = await User.findOne({ acno, psw });
    if (!user) {
      return res.status(401).json({ message: 'Invalid account number or password' });
    }

    // Create a token
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
    const user = await User.findOne({ acno, psw });
    if (!user) {
      return res.status(401).json({ message: 'Invalid account number or password' });
    }

    // Update the user's balance and record the transaction
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
    const user = await User.findOne({ acno, psw });
    if (!user) {
      return res.status(401).json({ message: 'Invalid account number or password' });
    }

    // Check if sufficient balance is available
    if (user.balance < Number(amnt)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update the user's balance and record the transaction
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
    const user = await User.findOne({ acno });
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
    const result = await User.deleteOne({ acno });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Account not found' });
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
