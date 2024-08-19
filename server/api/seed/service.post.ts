import { prisma } from "~/composables/prisma";


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const res = await prisma.serviceFee.createMany({
        data: body
    })
    return res
})