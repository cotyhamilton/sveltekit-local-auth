import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const getUserFromSession = async (id: string) => {
	try {
		const session = await prisma.session.findUnique({
			where: {
				id
			}
		});
		return prisma.user.findUnique({
			where: {
				id: session?.userId
			}
		});
	} catch (err) {
		return undefined;
	}
};
