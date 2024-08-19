import { prisma } from "~/composables/prisma";

import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const payload = {
      name: body.name,
      email: body.email,
      telp: body.telp,
      avatar: body.avatar,
      role: body.role,
      updated_at: new Date(),
      address: {
        update: {
          where: { id: body.address.id },
          data: {
            address_name: body.address.address_name,
          },
        },
      },
    } as any
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);
      payload['password'] = hashedPassword
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: body.id,
      },
      include: {
        address: {
          select: {
            address_name: true,
          },
        },
      },
      data: payload
    });
    return updatedUser;
  } catch (error) {
    // Menangani kesalahan yang mungkin terjadi selama pembaruan profile
    console.error("Error updating profile:", error);
    throw new Error("Error updating profile");
  }
});
