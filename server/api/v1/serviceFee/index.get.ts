import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    try {

        const res = await prisma.serviceFee.findMany({
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

        if (!res) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request!'
            })
        }

        return { data: res, status: 200 }

    } catch (error) {
        console.error('Error fetching and sorting transactions:', error);
        return { error: error, status: 500 };
    }
});
