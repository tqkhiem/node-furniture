const Products = require("../models/Products");
const router = require("express").Router();


router.get("/", async (req, res) => {
  const sort = req.query.sort;


  try {
    let products;
    if (Object.keys(sort)[0]== "view") {
      let keys = Object.keys(sort)[0]
      if (Object.values(sort)[0] == "desc") {
        products = await Products.find().sort({ "view": -1 })
        res.status(200).json(products);
      }else if (Object.values(sort)[0] == "esc"){
        products = await Products.find().sort({ "view": 1 })
        res.status(200).json(products);

      }

    } else {
      products = await Products.find()
    // console.log(products)
    res.status(200).json(products);
  }
} catch (err) {
  res.status(500).json(err);
}
});
router.get("/sort", async (req, res) => {

  try {
    let products;
    products = await Products.find().sort({ "view": -1 })
    console.log(products)
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;