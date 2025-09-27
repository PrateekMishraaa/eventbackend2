const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};



exports.register = async (req, res) => {
  try {
    const { email, password, role, state, district } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({ email, password, role, state, district });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.status(200).json({ token, role: user.role, state: user.state, district: user.district, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};



exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};
