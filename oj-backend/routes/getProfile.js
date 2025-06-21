const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserSolvedProblem = require('../models/UserSolvedProblem');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const solvedCount = await UserSolvedProblem.countDocuments({ user_id: user.userId });

    res.json({
      username: user.username,
      name: user.name,
      email: user.email,
      solved_problems: solvedCount,
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;