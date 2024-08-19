import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id') ?? '';
        const unit = await prisma.trashUnit.delete({
            where: {
                id: id,
            },

        });
        return { data: unit, status: 200 }
    } catch (error) {
        console.error('error deleting category', error);
        return { error: 'Internal server error', status: 500 };
    }
})