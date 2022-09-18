const User = require("../models/User");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');


function verifyToken(req, res, next) {
  const authorizationClient = req.headers['authorization'];
  const token = authorizationClient && authorizationClient.split(' ')[1]
  if (!token) return res.status(401).json({"message": "Vui lòng nhập Token.","status_code": 401})
    try {
      const userInfo = jwt.verify(token, PRIVATE_KEY)
      res.user = userInfo
      next()
    } catch (e) {
      return res.status(403).json({"message": "Token không hợp lệ.","status_code": 403})
    }
  }


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
      if (user) {
        // statement
        if ( user.password !== req.body.password ){
          res.status(401).json({"message": "Thông tin đăng nhập không đúng.","status_code": 401});
        }else{
          const accessToken = jwt.sign(
          { id: user._id,role: user.role },PRIVATE_KEY,{ expiresIn: "1d" });
          res.status(200).json({ accessToken,role: user.role });
        }
      }else{
        res.status(401).json({"message": "Thông tin đăng nhập không đúng.","status_code": 401});
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.get("/",verifyToken, async (req, res) => {
    try {
      const userId = res.user.id;
      const orders = await User.find({_id:userId});
      res.status(200).json(orders);

    } catch (err) {
      res.status(500).json(err);
    }
  });



  module.exports = router;