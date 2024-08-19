import { number } from "yup";
import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id') ?? '';

        const res = await prisma.transaction.findMany({
            where: {
                partner_id: id,
                OR: [
                    { status_id: 'STS3' },
                    { status_id: 'STS4' },
                ]
            },
            select: {
                total: true,
                updated_at: true,
            }
        });



        const lackOfFee = await prisma.serviceFee.findFirst({
            where: {
                partner_id: id
            },
            select: {
                lackOfFee: true
            },
            orderBy: { updated_at: 'desc' }
        })


        if (!res) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request!'
            })
        }

        const today = new Date();
        const currentMonth = today.getMonth() + 1;


        const { currentMonthService } = res.reduce((accumulator, transaction) => {
            const date = new Date(transaction.updated_at);
            const itemMonth = date.getMonth() + 1;

            if (itemMonth === currentMonth) {
                accumulator.currentMonthService += (transaction.total ?? 0) * 0.10; // 10% dari total biaya
            }

            return accumulator;
        }, { currentMonthService: 0 });



        return { currentMonthService: currentMonthService, lackOfFee: lackOfFee?.lackOfFee ?? 0 }

    } catch (error) {
        console.error('Error fetching and sorting transactions:', error);
        return { error: error, status: 500 };
    }
});
