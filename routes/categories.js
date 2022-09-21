const Categories = require("../models/Categories");
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


  router.get("/", async (req, res) => {
    try {
      let products;
      products = await Categories.find()
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.delete("/:id",verifyToken, async (req, res) => {
    try {
      const userRole = res.user.role;
      const IdLoai = req.params.id;
      if (userRole == "admin") {
        await Categories.findByIdAndDelete(IdLoai)
        res.status(200).json({"message": "Đã xoá thành công.","status_code": 200});
      }else {
        res.status(403).json({"message": "Bạn không phải là admin hoặc id không đúng.","status_code": 403});
        
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;