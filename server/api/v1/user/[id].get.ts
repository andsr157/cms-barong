// Import Prisma Client
import { prisma } from '~/composables/prisma';

// Definisikan event handler untuk API
export default defineEventHandler(async (event) => {

    try {
        // Ambil user_id dari parameter rute
        const id = getRouterParam(event, 'id') ?? '';

        // Dapatkan data transaksi dari Prisma
        const user = await prisma.users.findMany({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                telp: true,
                avatar: true,
                created_at: true,
                updated_at: true,
                role: true,
                address: true,
                password: true,
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
