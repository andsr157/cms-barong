import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try {
        const serviceFee = await prisma.serviceFee.create({
            data: {
                partner_id: body.partner_id,
                totalFee: body.totalFee,
                lackOfFee: body.lackOfFee,
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
        })

        if (!serviceFee) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request!'
            })
        }

        return { data: serviceFee, status: 200 }
    } catch (error) {
        console.error('error creating Service Fee', error);
        return { error: error, status: 500 };


    }
})