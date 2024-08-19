import { prisma } from "~/composables/prisma";

export default defineEventHandler(async (event) => {

    try {

        const totalUser = await prisma.users.count({
            where: {
                role: 'user'
            }
        });

        const totalPartner = await prisma.users.count({
            where: {
                role: 'partner'
            }
        });

        const totalSubCategory = await prisma.trash.count();

        const totalServiceFee = await prisma.serviceFee.aggregate({
            _sum: {
                totalFee: true
            }
        });

        const topPartners = await prisma.users.findMany({

            where: {
                role: 'partner'
            },
            include: {
                ReferredToUser: {
                    select: {
                        partner_rate: true
                    }
                }
            },
            orderBy: {
                ReferredToUser: {
                    _count: 'desc'
                }
            },
            take: 3
        });

        const topPartnerRate = topPartners.map(partner => {
            const validRatings = partner.ReferredToUser.filter(transaction => transaction.partner_rate !== null);
            const totalRate = partner.ReferredToUser.reduce((acc, trasaction) => acc + (trasaction.partner_rate || 0), 0);
            const rateCount = validRatings.length;
            const averageRate = rateCount > 0 ? parseFloat((totalRate / rateCount).toFixed(1)) : 0;
            return {
                id: partner.id,
                name: partner.name,
                avatar: partner.avatar,
                averageRate
            };
        }).sort((a, b) => b.averageRate - a.averageRate).slice(0, 3);

        const topTrash = await prisma.transaction_detail.groupBy({
            by: ['trash_id'],
            _count: {
                trash_id: true
            },
            orderBy: {
                _count: {
                    trash_id: 'desc'
                }
            },
            take: 5
        });

        const topTrashId = topTrash.map(item => item.trash_id);

        const topTrashDetail = await prisma.trash.findMany({
            where: {
                id: {
                    in: topTrashId
                }
            },
            select: {
                id: true,
                name: true,
                minPrice: true,
                maxPrice: true
            }
        });

        const topTrashItems = topTrash.map(item => {
            const trashDetail = topTrashDetail.find(trash => trash.id === item.trash_id);
            return {
                ...trashDetail,
                saleCount: item._count.trash_id
            };
        });

        return {
            status: 200,
            data: {
                totalPartner,
                totalUser,
                totalSubCategory,
                totalServiceFee: totalServiceFee._sum.totalFee || 0,
                topPartners: topPartnerRate,
                topTrashItems
            }
        }

        // return totalUser
    } catch (error) {
        console.error('error fetching total user :', error);
        return {
            status: 500,
            error: 'Internal server error'
        }
    }

})