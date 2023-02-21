const { Router } = require("express");
const router = Router();

router.use("/", require("./auth"));
router.use("/category-products", require("./category"));
router.use("/products", require("./product"));

module.exports = router;
