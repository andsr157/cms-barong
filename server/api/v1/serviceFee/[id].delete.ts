import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    try {

        const id = await getRouterParam(event, 'id') ?? '';

        const delServiceFee = await prisma.serviceFee.delete({
            where: {
                id: id,
            },

        });

        return { data: delServiceFee, status: 200 }

    } catch (error) {
        console.error('error deleting category', error);

        return { error: 'Internal server error', status: 500 };
    }
})