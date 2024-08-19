import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const res = await prisma.trashCategory.createMany({
        data: body
    })
    return res
})