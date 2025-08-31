const { Router } = require("express");
const {
  addAddress,
  getAddresses,
  deleteAddress,
  editAddress,
} = require("../../controllers/shop/address.controller");

const router = Router();

router.post("/add", addAddress);
router.get("/all", getAddresses);
router.patch("/edit/:id", editAddress);
router.delete("/delete/:id", deleteAddress);
router.get("/:id", getAddresses);

module.exports = router;
