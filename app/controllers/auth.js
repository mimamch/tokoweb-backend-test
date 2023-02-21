const { PrismaClient } = require("@prisma/client");
const { isUserExist, createTokenJWT } = require("../services/auth-services");
const {
  responseErrorWithMessage,
  responseErrorWithDefaultMessage,
  responseSuccessWithData,
} = require("../utils/http-response");

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (await isUserExist(email))
      return res
        .status(409)
        .json(responseErrorWithMessage(`Email ${email} is already registered`));

    await prisma.user.create({
      data: {
        email,
        password,
      },
    });
    res
      .status(200)
      .json(
        responseSuccessWithData({ email: email, token: createTokenJWT(email) })
      );
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || user?.password != password)
      return res
        .status(403)
        .json(responseErrorWithMessage(`Incorrect Email or Password`));

    res
      .status(200)
      .json(
        responseSuccessWithData({ email: email, token: createTokenJWT(email) })
      );
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
