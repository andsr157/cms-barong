import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    try {

        const id = getRouterParam(event, 'id') ?? '';

        const delCategory = await prisma.trashCategory.delete({
            where: {
                id: id,
            },

        });

        return { data: delCategory, status: 200 }

    } catch (error) {
        console.error('error deleting category', error);

        return { error: 'Internal server error', status: 500 };
    }
})