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

exports.createTokenJWT = (data) => {
  return jwt.sign({ ...data }, process.env.JWT_SECRET_KEY ?? "testing", {
    expiresIn: "7d",
  });
};
