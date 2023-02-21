const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

exports.isUserExist = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return !!user;
};

exports.createTokenJWT = (email) => {
  return jwt.sign({ email: email }, process.env.JWT_SECRET_KEY ?? "testing", {
    expiresIn: "7d",
  });
};
