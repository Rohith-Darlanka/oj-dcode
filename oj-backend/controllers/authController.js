const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
      role: 'user' 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


    
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
       path: '/',
    };

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getProfile = async (req, res) => {
  try {
    res.status(200).json({ message: "Profile fetched successfully", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const verifyAuth = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        userId: req.user.userId,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { registerUser, loginUser, getProfile, verifyAuth  };
