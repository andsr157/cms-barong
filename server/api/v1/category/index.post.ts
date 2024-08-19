import { prisma } from "~/composables/prisma";

async function genereteCategoryId() {

    const existingCategories = await prisma.trashCategory.findMany({
        select: { id: true }
    });

    const existingIds = existingCategories.map(category => parseInt(category.id.replace('CTR30', '')));

    let newIdNumber = 1;
    while (existingIds.includes(newIdNumber)) {
        newIdNumber++;
    }

    return `CTR30${newIdNumber}`;
}

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try {

        const newCategoryId = await genereteCategoryId();

        const newCategory = await prisma.trashCategory.create({
            data: {
                id: newCategoryId,
                name: body.name
            }
        });


        return {
            status: 200,
            message: 'Category created successfully',
            newCategory
        }


    } catch (error) {
        console.error('error creating category', error);

        return { error: 'Internal server error', status: 500 };
    }
})