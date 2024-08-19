import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try {
        const updateCategory = await prisma.trashCategory.update({
            where: {
                id: body.id,
            },
            data: {
                name: body.name
            }
        })

        return updateCategory
    } catch (error) {
        console.error('Error updeting category', error);
        return { error: 'Internal server error', status: 500 };
    }
})