import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try {

        const existingIds = await prisma.trash.findMany({
            where: {
                category_id: body.category_id,
            },
            orderBy: {
                id: 'asc',

            },
            select: {
                id: true,
            }

        });


        const categoryPrefix = body.category_id.toString().slice(-1);

        // Ekstrak nomor dari ID dan simpan dalam array
        const existingNumbers = existingIds.map(item => parseInt(item.id.slice(-2), 10));

        let newNumber = 1;
        for (let i = 1; i <= existingNumbers.length + 1; i++) {
            if (!existingNumbers.includes(i)) {
                newNumber = i;
                break;
            }
        }

        const newId = `RSK${categoryPrefix}${newNumber.toString().padStart(2, '0')}`;

        const createTrash = await prisma.trash.create({
            data: {
                id: newId,
                name: body.name,
                minPrice: body.minPrice,
                maxPrice: body.maxPrice,
                unit_id: body.unit_id,
                category_id: body.category_id
            },
            select: {
                id: true,
                name: true,
                minPrice: true,
                maxPrice: true,
                category: true,
                unit: true
            }
        })

        if (!createTrash) {
            throw createError({
                statusCode: 400,
                statusMessage: 'bad request'
            })
        }

        return { data: createTrash, status: 200 }
    } catch (error) {
        console.error('error creating trash data', error);
        return { error: error, status: 500 };
    }
})