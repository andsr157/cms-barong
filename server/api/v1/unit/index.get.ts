import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    try {
        const unit = await prisma.trashUnit.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        unit.sort((a, b) => {
            const aId = parseInt(a.id.replace('UNT40', ''));
            const bId = parseInt(b.id.replace('UNT40', ''));
            return aId - bId;
        })
        return { data: unit, status: 200 }
    } catch (error) {
        console.error('Error fetching category data:', error);

        return { error: error, status: 500 };
    }

})