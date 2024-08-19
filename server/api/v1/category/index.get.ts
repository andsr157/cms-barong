import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    try {

        const category = await prisma.trashCategory.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        category.sort((a, b) => {
            const aId = parseInt(a.id.replace('CTR30', ''));
            const bId = parseInt(b.id.replace('CTR30', ''));
            return aId - bId;
        })

        return { data: category, status: 200 }

    } catch (error) {
        console.error('Error fetching category data:', error);

        return { error: error, status: 500 };
    }

})