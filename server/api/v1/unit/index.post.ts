import { prisma } from "~/composables/prisma";


async function genereteTrashUnitId() {

    const existingTrashUnit = await prisma.trashUnit.findMany({
        select: {
            id: true,
        }
    });

    const existingIds = existingTrashUnit.map(unit => parseInt(unit.id.replace('UNT40', '')));

    let newIdNumber = 1;
    while (existingIds.includes(newIdNumber)) {
        newIdNumber++;
    }

    return `UNT40${newIdNumber}`;


}

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try {

        const newUnitTrashId = await genereteTrashUnitId();

        const unit = await prisma.trashUnit.create({
            data: {
                id: newUnitTrashId,
                name: body.name
            }
        })
        return {
            status: 200,
            message: 'Unit created successfully',
            data: unit,
        }
    } catch (error) {
        console.error('error creating category', error);

        return { error: 'Internal server error', status: 500 };
    }
})