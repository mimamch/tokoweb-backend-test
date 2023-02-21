const { Router } = require("express");
const productController = require("../controllers/product");

const router = Router();

router.get("/", productController.getProduct);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
