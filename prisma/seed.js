const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const main = async () => {
  const createUser = await prisma.user.create({
    data: {
      email: "user@user.com",
      password: "changeme",
    },
  });
  const createCategoryAndProduct = await prisma.categoryProduct.upsert({
    where: {
      slug: "shoes",
    },
    create: {
      name: "Shoes",
      slug: "shoes",
      products: {
        create: {
          name: "Nike Sport Shoes",
          image: "nike-picture.png",
          price: 100000,
          user_id: createUser.id_user,
        },
      },
    },
    update: {},
  });
  console.log(createUser);
  console.log(createCategoryAndProduct);
};
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
