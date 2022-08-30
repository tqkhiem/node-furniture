const Products = require("../models/Products");
const router = require("express").Router();


router.get("/", async (req, res) => {

  try {
    let products;
    products = await Products.find()
    console.log(products)
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;