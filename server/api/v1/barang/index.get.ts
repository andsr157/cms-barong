import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    try {
        const getTrash = await prisma.trash.findMany({
            select: {
                id: true,
                name: true,
                minPrice: true,
                maxPrice: true,
                unit: true,
                category: true,
            },
            orderBy: {
                id: 'asc'
            }
        })
        return { data: getTrash, status: 200 }
    } catch (error) {
        console.error('error fetching trash data ', error);
        return { error: 'Internal server error', status: 500 };
    }
})