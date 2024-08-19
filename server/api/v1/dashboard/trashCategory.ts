import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    try {
        const currentYear = new Date().getFullYear();
        const transaction_detail = await prisma.transaction_detail.findMany({
            where: {
                transaction: {
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
                }
            },
            select: {
                transaction: {
                    select: {
                        updated_at: true
                    }
                },
                weight: true,
                trash: {
                    select: {
                        category_id: true
                    }
                }
            }
        });

        // return transaction_detail

        const trashCategory = await prisma.trashCategory.findMany({
            select: {
                id: true,
                name: true
            }
        })

        const data = trashCategory.map((i) => {
            return { ...i, weight: 0 }
        })


        trashCategory.forEach((category) => {
            const currentIndex = data.findIndex((data) => data.id === category.id)
            if (currentIndex !== -1) {
                transaction_detail.forEach((transaction) => {
                    if (transaction.trash.category_id === category.id) {
                        data[currentIndex].weight += transaction.weight
                    }
                });
            }

        })

        return data;

    } catch (error) {
        console.error('error fetching total user :', error);
        return {
            status: 500,
            error: 'Internal server error'
        }
    }

})