import { prisma } from '~/composables/prisma';
export default defineEventHandler(async (event) => {
    const type = getRouterParam(event, 'type') ?? '';
    try {
        let data

        if (type === 'transaction') {
            data = await prisma.transaction.findMany({
                where: {
                    OR: [{ status_id: 'STS3' }, { status_id: 'STS4' }]
                }, select: {
                    updated_at: true
                },
                orderBy: {
                    updated_at: 'asc'
                }
            });
        }

        if (type === 'serviceFee') {
            data = await prisma.serviceFee.findMany({
                select: {
                    updated_at: true
                },
                orderBy: {
                    updated_at: 'asc'
                }
            });
        }

        if (data) {
            const uniqueYears: number[] = data.reduce((years: number[], data: any) => {
                const year = new Date(data.updated_at).getFullYear();
                if (!years.includes(year)) {
                    years.push(year);
                }
                return years;
            }, []);

            const formatedData = uniqueYears.map((data) => {
                return { name: data.toString(), value: data }
            })
            return { data: formatedData, status: 200 };
        }

    } catch (error) {
        console.error('Error fetching transaction data:', error);
        return { error: error, status: 500 };
    }
});
