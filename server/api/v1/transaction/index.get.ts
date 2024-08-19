// Import Prisma Client
import { prisma } from '~/composables/prisma';
// Definisikan event handler untuk API
export default defineEventHandler(async (event) => {

    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                user: true,
                partner: true,
                transaction_detail: {
                    include: {
                        trash: {
                            include: {
                                category: true,
                            }
                        },
                    },
                },
                status: true,
            },
        });



        const addressData = JSON.parse(transactions[0].address)

        // Format data transaksi sesuai dengan struktur yang diinginkan
        const formattedTransactions = transactions.map((data: any) => {
            const status = { id: data.status.id, ...data.status };
            return {
                id: data.id,
                user: data.user?.name ?? '-',
                pengepul: data.partner?.name ?? '-',
                address: addressData ? { address: addressData.address_name } : { address: 'No Address' },

                detailSampah: data.transaction_detail.map((detail: any) => ({
                    id: detail.id,
                    category: detail.trash?.category?.name,
                    subcategory: detail.trash?.name,
                    weight: detail.weight,
                    finalPrice: detail.price,
                })),
                totalPrice: data.total ?? 0,
                servicePrice: (data.total ?? 0) * 10 / 100,
                finalTotalPrice: (data.total ?? 0) - ((data.total ?? 0) * 10 / 100),
                status: status,
                note: data.note,
                date: data.updated_at
            };
        });

        return { data: formattedTransactions, status: 200 };
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        return { error: 'Internal server error', status: 500 };
    }
});
