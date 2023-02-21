const jwt = require("jsonwebtoken");
const { responseErrorWithMessage } = require("../utils/http-response");
const checkIsAuth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw new Error();
    token = token.split(" ").pop();
    jwt.verify(token, process.env.JWT_SECRET_KEY ?? "testing");
    next();
  } catch (error) {
    res
      .status(401)
      .json(
        responseErrorWithMessage("You must login first before access this page")
      );
  }
};
module.exports = checkIsAuth;
