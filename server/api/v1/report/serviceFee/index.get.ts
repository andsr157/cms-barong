import { prisma } from '~/composables/prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { generateTrashNames } from '~/server/helpers'

export default defineEventHandler(async (event) => {
    const query = getQuery(event) as any;

    const queryPrisma = {
        select: {
            id: true,
            users: { select: { name: true } },
            totalFee: true,
            lackOfFee: true,
            updated_at: true,
        }
    };

    try {
        let serviceFee: any;
        let startDate: Date;
        let endDate: Date;

        switch (query.filter) {
            case 'date':
                startDate = startOfDay(new Date(query.start));
                endDate = endOfDay(new Date(query.end));
                break;

            case 'month':
                const year = parseInt(query.year);
                const startMonth = parseInt(query.start);
                const endMonth = parseInt(query.end);

                if (startMonth < 1 || startMonth > 12 || endMonth < 1 || endMonth > 12) {
                    throw createError({
                        statusCode: 400,
                        statusMessage: 'Invalid start or end month'
                    });
                }

                startDate = startOfMonth(new Date(year, startMonth - 1));
                endDate = endOfMonth(new Date(year, endMonth - 1));
                break;

            case 'year':
                const yearValue = parseInt(query.year);
                if (!yearValue) {
                    throw createError({
                        statusCode: 400,
                        statusMessage: 'Invalid filter or missing year parameter'
                    });
                }

                startDate = new Date(yearValue, 0);
                endDate = new Date(yearValue + 1, 0);
                break;

            default:
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Invalid filter parameter'
                });
        }

        serviceFee = await prisma.serviceFee.findMany({
            where: {
                updated_at: {
                    lte: endDate,
                    gte: startDate,
                }
            },
            ...queryPrisma
        });

        const totalServiceFee = serviceFee.reduce((acc: number, curr: any) => {
            return acc + curr.totalFee
        }, 0)

        return { data: serviceFee, total: totalServiceFee, status: 200 };
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        return { error: error, status: 500 };
    }
});
