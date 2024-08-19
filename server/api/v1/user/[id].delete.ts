import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id') ?? '';

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: id
            },
            include: {
                address: true,
            }
        });

        if (!user) {
            return { data: {}, status: 400 }
        }

        await prisma.address.deleteMany({
            where: {
                user_id: user.id
            }
        });

        await prisma.users.delete({
            where: {
                id: user.id
            }
        });

        return { data: user, status: 200 }
    } catch (error) {
        console.log('Error deleting user:', error);
        throw new Error('Error deleting user')
    }
})