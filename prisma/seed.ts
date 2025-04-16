const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
    const hashedPassword = await bcrypt.hash("123456", 10)
    const user = await prisma.users.create({
        data: {
            email: "teste@teste.com",
            name: "Teste",
            password: hashedPassword,
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });