const { Router } = require("express");
const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/product.controller");
const router = Router();

router.get("/get", getFilteredProducts);
// GET /api/products?category=electronics,clothing
// GET /api/products?brand=logitech
// GET /api/products?sortBy=price-highToLow
// GET /api/products?sortBy=title-aToZ
// GET /api/products?category=electronics&brand=logitech,samsung&sortBy=price-highToLow
// GET /api/products?brand=asus,canon&sortBy=price-lowToHigh
router.get("/get/:id", getProductDetails);

module.exports = router; 
