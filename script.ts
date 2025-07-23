import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetUser = await prisma.user.findUnique({
        where: {
            id: 1,
        },
        select: {
            isPrivate: true,
            followers: {
                where: { followerId: 3 },
                select: {
                    id: true,
                },
            },
        },
    });
    console.log(targetUser);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
