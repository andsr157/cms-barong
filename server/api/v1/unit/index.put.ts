import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const unit = await prisma.trashUnit.update({
            where: {
                id: body.id,
            },
            data: {
                name: body.name
            }
        })
        return { data: unit, status: 200 }
    } catch (error) {
        console.error('Error updeting category', error);
        return { error: 'Internal server error', status: 500 };
    }
})