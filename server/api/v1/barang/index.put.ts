import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const updateTrash = await prisma.trash.update({
            where: {
                id: body.id,
            },
            data: {
                name: body.name,
                minPrice: body.minPrice,
                maxPrice: body.maxPrice,
                unit_id: body.unit_id,
                category_id: body.category_id
            },
            select: {
                id: true,
                name: true,
                minPrice: true,
                maxPrice: true,
                category: true,
                unit: true
            }
        })
        return { data: updateTrash, status: 200 }
    } catch (error) {
        console.log('error updating Trash', error);
        return { error: 'Internal server error', status: 500 };
    }
})