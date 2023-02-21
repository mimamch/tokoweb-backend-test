const { PrismaClient } = require("@prisma/client");
const {
  responseSuccessWithData,
  responseErrorWithMessage,
  responseErrorWithDefaultMessage,
  responseSuccessWithMessage,
} = require("../utils/http-response");
const prisma = new PrismaClient();
exports.getCategory = async (req, res) => {
  try {
    const data = await prisma.categoryProduct.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json(responseSuccessWithData(data));
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id)
      return res
        .status(400)
        .json(responseErrorWithMessage("Invalid Parameters"));
    const data = await prisma.categoryProduct.findUnique({
      where: {
        id_category: id,
      },
    });
    if (!data)
      return res.status(404).json(responseErrorWithMessage(`Data Not Found`));
    res.status(200).json(responseSuccessWithData(data));
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().trim().replaceAll(" ", "-");
    const data = await prisma.categoryProduct.upsert({
      where: {
        slug: slug,
      },
      create: {
        name: name,
        slug: slug,
      },
      update: {},
    });

    res.status(200).json(responseSuccessWithData(data));
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().trim().replaceAll(" ", "-");
    const id = parseInt(req.params.id);
    if (!id)
      return res
        .status(400)
        .json(responseErrorWithMessage("Invalid Parameters"));
    const isExist = await prisma.categoryProduct.findUnique({
      where: {
        id_category: id,
      },
    });
    if (!isExist)
      return res
        .status(404)
        .json(responseErrorWithMessage(`Data with ID : ${id} doesn't exist`));
    const data = await prisma.categoryProduct.update({
      where: {
        id_category: id,
      },
      data: {
        name: name,
        slug: slug,
      },
    });

    res.status(200).json(responseSuccessWithData(data));
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id)
      return res
        .status(400)
        .json(responseErrorWithMessage("Invalid Parameters"));
    const data = await prisma.categoryProduct.findUnique({
      where: {
        id_category: id,
      },
    });
    if (!data)
      return res
        .status(404)
        .json(responseErrorWithMessage(`Data with ID : ${id} doesn't exist`));
    await prisma.$transaction(async (tx) => {
      await tx.product.deleteMany({
        where: {
          category_id: id,
        },
      });
      await tx.categoryProduct.delete({
        where: {
          id_category: id,
        },
      });
    });
    res.status(200).json(responseSuccessWithMessage());
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
