const Products = require("../models/Products");
const router = require("express").Router();
function verifyToken(req, res, next) {
  const authorizationClient = req.headers['authorization'];
  const token = authorizationClient && authorizationClient.split(' ')[1]
  if (!token) return res.status(401).json({ "message": "Vui lòng nhập Token.", "status_code": 401 })
  try {
    const userInfo = jwt.verify(token, PRIVATE_KEY)
    res.user = userInfo
    next()
  } catch (e) {
    return res.status(403).json({ "message": "Token không hợp lệ.", "status_code": 403 })
  }
}

router.get("/", async (req, res) => {
  const sort = req.query.sort;
  try {
    let products;
    if (sort) {
      let order_by;
      let values = Object.values(sort)[0];
      values == "desc" ? order_by = -1 : order_by = 1;
      let keys = Object.keys(sort)[0];
      switch (keys) {
        case "view":
          products = await Products.find().sort({ view: order_by }).limit(8)
          break;
        case "date":
          products = await Products.find().sort({ date: order_by }).limit(8)
          break;
        default:

      }
    } else {
      products = await Products.find()
    }
    res.status(200).json(products);

  } catch (err) {
    res.status(500).json(err);
  }
});
router.post('/', verifyToken, async (req, res) => {
  const newProduct = new Products(req.body);
  const userRole = res.user.role;
  try {
    if (userRole == "admin") {
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } else {
      res.status(403).json({ "message": "Bạn không phải là admin hoặc id không đúng.", "status_code": 403 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/', verifyToken, async (req, res) => {
  const userRole = res.user.role;
  try {
    if (userRole == "admin") {
      const product = await Products.findById(req.body._id);
      if (product) {
        await product.updateOne({ $set: req.body });
        res.status(200).json({ "message": "Đã cập nhật thành công.", "status_code": 200 });
      } else {
        res.status(404).json({ "message": "Không tìm thấy sản phẩm.", "status_code": 404 });
      }
    } else {
      res.status(403).json({ "message": "Bạn không phải là admin hoặc id không đúng.", "status_code": 403 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});





module.exports = router;