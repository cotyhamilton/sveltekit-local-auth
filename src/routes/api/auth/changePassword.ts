import bcrypt from "bcrypt";
import * as cookie from "cookie";

import { prisma } from "$lib/common/db";
import { BadRequestException, HTTPError } from "$lib/common/httpErrors";
import { respond } from "$lib/common/respond";

import type { RequestHandler } from "./__types/changePassword";

export const post: RequestHandler = async ({ request, locals }) => {
	try {
		const { currentPassword, newPassword } = await request.json();

		// get session
		const { session_id } = cookie.parse(request.headers.get("cookie") || "");
		const session = await prisma.session.findUnique({
			where: {
				id: session_id
			}
		});

		// get user
		const user = await prisma.user.findUnique({
			where: {
				id: session?.userId
			}
		});
		if (!user) {
			return respond.Error();
		}

		// compare password
		if (!(await bcrypt.compare(currentPassword, user.password))) {
			return respond.Error({ message: "Incorrect password", status: 200 });
		}

		// validate new password
		if (newPassword.length < 8) {
			throw new BadRequestException("New password must be at least 8 characters");
		}

		// hash new password
		const hash = await bcrypt.hash(newPassword, 10);

		// update password
		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				password: hash
			}
		});

		return respond.Ok({ message: "Password updated successfully" });
	} catch (err) {
		if (err instanceof HTTPError) {
			return respond.Error(err);
		}
		console.error(err);
		return respond.Error();
	}
};
