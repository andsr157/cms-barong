import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    try {
        const currentYear = new Date().getFullYear();
        const transactionCounts = await prisma.transaction.groupBy({
            by: ['updated_at'],
            where: {
                AND: [
                    {
                        updated_at: {
                            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                            lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                        }
                    },
                    {
                        OR: [
                            { status_id: 'STS3' },
                            { status_id: 'STS4' }
                        ]
                    }
                ]
            },
            _count: {
                _all: true,
            },
        });

        // return transactionCounts

        const monthlyCounts = Array(12).fill(0);

        transactionCounts.forEach((transaction) => {
            const month = new Date(transaction.updated_at).getMonth();
            monthlyCounts[month] += transaction._count._all;
        });

        return monthlyCounts;

        // return totalUser
    } catch (error) {
        console.error('error fetching total user :', error);
        return {
            status: 500,
            error: 'Internal server error'
        }
    }

})