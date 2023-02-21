const { Router } = require("express");
const checkIsAuth = require("../middleware/checkIsAuth");
const router = Router();

router.use("/", require("./auth"));
router.use("/category-products", checkIsAuth, require("./category"));
router.use("/products", checkIsAuth, require("./product"));

module.exports = router;
