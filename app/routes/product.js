const { Router } = require("express");
const fileUpload = require("express-fileupload");
const productController = require("../controllers/product");
const router = Router();

router.get("/", productController.getProduct);
router.get("/:id", productController.getProductById);
router.post("/", fileUpload(), productController.createProduct);
router.put("/:id", fileUpload(), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
