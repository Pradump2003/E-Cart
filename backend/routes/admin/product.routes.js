const { Router } = require("express");

const {
  imageUpload,
  addProduct,
  fetchAllProducts,
  deleteProduct,
  updateProduct,
} = require("../../controllers/admin/product.controller");
const { upload } = require("../../middleware/multer.middleware");

const router = Router();

router.post("/upload-image", upload.single("image"), imageUpload);
router.post("/add", addProduct);
router.get("/all", fetchAllProducts);
router.patch("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
