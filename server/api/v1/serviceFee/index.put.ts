import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try {
        const updateServiceFee = await prisma.serviceFee.update({
            where: {
                id: body.id,
            },
            data: {
                totalFee: body.totalFee,
                lackOfFee: body.lackOfFee,
                updated_at: new Date()
            },
            select: {
                id: true,
                users: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                totalFee: true,
                lackOfFee: true,
            }
        });

        if (!updateServiceFee) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request!'
            })
        }

        return { data: updateServiceFee, status: 200 }

    } catch (error) {
        console.error('error updating service fee', error);
        return { error: error, status: 500 }
    }

})

