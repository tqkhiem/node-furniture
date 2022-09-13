const Products = require("../models/Products");
const router = require("express").Router();


router.get("/", async (req, res) => {
  const sort = req.query.sort;
  try {
    let products;
    if (sort) {
      let order_by;
      let values = Object.values(sort)[0];
      values == "desc" ? order_by = -1 : order_by = 1;
      let keys = Object.keys(sort)[0]; // giá trị của keys là view
      if (keys == "view") {
      products = await Products.find().sort({ view: order_by })
      }
    } else {
      products = await Products.find()
    }
    res.status(200).json(products);

  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;