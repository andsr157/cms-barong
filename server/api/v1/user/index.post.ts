import { prisma } from "~/composables/prisma";
import bcrypt from 'bcrypt';
import { getNextNumber } from '~/server/helpers'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { name, email, telp, role, avatar, password, address } = body;
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(body.password, salt)


        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                telp,
                role,
                avatar,
                password: hashedPassword,
                ...(address && {
                    address: {
                        create: {
                            address_name: address,
                            label: '',
                            detail: '',
                            latitude: '',
                            longitude: '',
                            is_main: true,
                            owner_telp: '',
                            owner_name: '',
                        }
                    }
                })
            }
        });

        return newUser;

    } catch (error) {
        console.log('Error creating user:', error);
        throw new Error('Error creating user');
    }

});