const express = require('express');
const router = express.Router();
const Member = require('../models/member');

// Create Member
router.post('/members', async (req, res) => {
  try {
    const { name, email } = req.body;
    const member = new Member({
      name,
      email
    });
    await member.save();
    res.status(201).send({ _id: member._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;