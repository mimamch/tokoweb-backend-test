const { PrismaClient } = require("@prisma/client");
const rootDir = require("../../__dirname");
const path = require("path");
const {
  responseSuccessWithData,
  responseErrorWithDefaultMessage,
  responseErrorWithMessage,
  responseSuccessWithMessage,
} = require("../utils/http-response");
const { fstat, unlinkSync } = require("fs");
const prisma = new PrismaClient();
exports.getProduct = async (req, res) => {
  try {
    const data = await prisma.product.findMany({});
    res.status(200).json(responseSuccessWithData(data));
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
exports.getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id)
      return res
        .status(400)
        .json(responseErrorWithMessage("Invalid Parameters"));
    const data = await prisma.product.findUnique({
      where: {
        id_product: id,
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
exports.createProduct = async (req, res) => {
  try {
    let { name, id_category, price } = req.body;
    if (!name || !id_category || !price || !req.files?.image) {
      return res
        .status(400)
        .json(responseErrorWithMessage("Invalid Parameters"));
    }
    const extFile = req.files.image.name.split(".").pop();
    const fileName = `${name}-${new Date().getTime()}.${extFile}`;

    req.files.image.mv(`public/images/${fileName}`, async (err) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json(
            responseErrorWithMessage(
              "Something went error when uploading image"
            )
          );
      }
      const data = await prisma.product.create({
        data: {
          name,
          category: {
            connect: {
              id_category: parseInt(id_category),
            },
          },
          price: parseInt(price),
          image: fileName,
          user: {
            connect: {
              id_user: req.user.id_user,
            },
          },
        },
      });
      return res.status(200).json(responseSuccessWithData(data));
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
exports.updateProduct = async (req, res) => {
  try {
    let { name, id_category, price } = req.body;
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(responseErrorWithMessage("Invalid Parameters"));
    }

    if (req.files?.image) {
      const extFile = req.files.image.name.split(".").pop();
      const fileName = `${name}-${new Date().getTime()}.${extFile}`;

      req.files.image.mv(`public/images/${fileName}`, async (err) => {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .json(
              responseErrorWithMessage(
                "Something went error when uploading image"
              )
            );
        }
        const data = await prisma.product.update({
          data: {
            name: name ?? undefined,
            category: id_category
              ? {
                  connect: {
                    id_category: parseInt(id_category),
                  },
                }
              : undefined,
            price: price ? parseInt(price) : undefined,
            image: fileName,
          },
          where: {
            id_product: parseInt(id),
          },
        });
        return res.status(200).json(responseSuccessWithData(data));
      });
    } else {
      const data = await prisma.product.update(
        {
          data: {
            name: name ?? undefined,
            category: id_category
              ? {
                  connect: {
                    id_category: parseInt(id_category),
                  },
                }
              : undefined,
            price: price ? parseInt(price) : undefined,
          },
          where: {
            id_product: parseInt(id),
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json(responseSuccessWithData(data));
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id)
      return res
        .status(400)
        .json(responseErrorWithMessage("Invalid Parameters"));
    const data = await prisma.product.findUnique({
      where: {
        id_product: id,
      },
    });
    if (!data)
      return res
        .status(404)
        .json(responseErrorWithMessage(`Data with ID : ${id} doesn't exist`));
    unlinkSync(path.join(`${rootDir}/public/images/${data.image}`));
    await prisma.product.delete({
      where: {
        id_product: id,
      },
    });
    res.status(200).json(responseSuccessWithMessage());
  } catch (error) {
    console.log(error);
    res.status(400).json(responseErrorWithDefaultMessage());
  }
};
