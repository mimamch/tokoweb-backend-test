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

    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });
    res.status(201).json(
      responseSuccessWithData({
        email: user.email,
        token: createTokenJWT({ id_user: user.id_user, email: user.email }),
      })
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

    res.status(200).json(
      responseSuccessWithData({
        email: user.email,
        token: createTokenJWT({ id_user: user.id_user, email: user.email }),
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
