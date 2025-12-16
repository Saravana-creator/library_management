const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Librarian = require('../models/Librarian');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const librarian = await Librarian.findOne({ username });

    if (!librarian || !(await librarian.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(librarian._id);
    res.json({
      token,
      librarian: {
        id: librarian._id,
        username: librarian.username,
        email: librarian.email,
        role: librarian.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const librarian = new Librarian({ username, email, password });
    await librarian.save();

    const token = generateToken(librarian._id);
    res.status(201).json({
      token,
      librarian: {
        id: librarian._id,
        username: librarian.username,
        email: librarian.email,
        role: librarian.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { login, register };