import { prisma } from '~/composables/prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { generateTrashNames } from '~/server/helpers'

export default defineEventHandler(async (event) => {
    const query = getQuery(event) as any;

    const queryPrisma = {
        where: {
            OR: [{ status_id: 'STS3' }, { status_id: 'STS4' }]
        },
        select: {
            id: true,
            address: true,
            total: true,
            updated_at: true,
            user: { select: { name: true } },
            partner: { select: { name: true } },
            transaction_detail: {
                select: {
                    weight: true,
                    trash: { select: { name: true } },
                }
            },
        }
    };

    try {
        let transactions: any;
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

        transactions = await prisma.transaction.findMany({
            ...queryPrisma,
            where: {
                ...queryPrisma.where,
                updated_at: {
                    lte: endDate,
                    gte: startDate,
                }
            }
        });

        const formatedData = transactions.map((data: any) => {
            const address = JSON.parse(data.address)
            return {
                id: data.id,
                partner: data.partner.name,
                user: data.user.name,
                address: address.address_name,
                total: data.total,
                totalWeight: data.transaction_detail.reduce((acc: number, curr: any) => {
                    return acc + curr.weight
                }, 0),
                trash_detail: generateTrashNames(data.transaction_detail),
                date: data.updated_at,
            }
        })

        const totalTransactions = transactions.reduce((acc: number, curr: any) => {
            return acc + curr.total
        }, 0)

        return { data: formatedData, total: totalTransactions, status: 200 };
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        return { error: error, status: 500 };
    }
});
