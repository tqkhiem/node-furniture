const Products = require("../models/Products");
const router = require("express").Router();


router.get("/", async (req, res) => {
  const sort = req.query.sort;
  try {
    let products;
    if (sort) {
      if (Object.values(sort)[0] == "desc") {
        products = await Products.find().sort({ "view": -1 })
      }else if (Object.values(sort)[0] == "esc"){
        products = await Products.find().sort({ "view": 1 })
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