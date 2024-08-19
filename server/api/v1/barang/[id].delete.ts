import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    try {

        const id = getRouterParam(event, 'id') ?? '';

        const delTrash = await prisma.trash.delete({
            where: {
                id: id,
            },
        });

        return { data: delTrash, status: 200 }

    } catch (error) {
        console.error('error deleting category', error);

        return { error: 'Internal server error', status: 500 };
    }
})