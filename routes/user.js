const User = require("../models/User");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');



router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {

    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials!");
    if ( user.password !== req.body.password ){
      res.status(401).json("Wrong credentials!");
    }
    const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    PRIVATE_KEY,
    { expiresIn: "1d" }
    );
    res.status(200).json({ username: user.username,role: user.role, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;