// Import Prisma Client
import { prisma } from '~/composables/prisma';

// Definisikan event handler untuk API
export default defineEventHandler(async (event) => {

    try {
        // Dapatkan data transaksi dari Prisma
        const user = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                address: {
                    where: {
                        is_main: true
                    }
                },
                telp: true,

            },
            where: {
                role: 'partner'
            }
        });


        // Kembalikan respons dengan data transaksi yang diformat
        return { data: user, status: 200 };
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        // Kembalikan respons dengan pesan error
        return { error: 'Internal server error', status: 500 };
    }
});