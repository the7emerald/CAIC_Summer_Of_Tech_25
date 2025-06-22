const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const UserCredentials = require('../models/userCredentials');
const { checkAuth } = require('../middleware/userAuth');

// Get conversation history
router.get('/:userId', checkAuth, async (req, res) => {
  if (req.user.username != userId) {
    return res.status(403);
  }
  let messgaesSent = Message.find({ sender: UserCredentials.findOne({ username: req.user.username }) })
  let messgaesGot = Message.find({ receiver: UserCredentials.findOne({ username: req.user.username }) })

  const messages = { messgaesGot, messgaesSent }
  res.json(messages)
});

module.exports = router;