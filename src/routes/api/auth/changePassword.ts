import bcrypt from "bcrypt";
import * as cookie from "cookie";

import { assertIsError } from "$lib/utils/assertions";
import { prisma } from "$lib/utils/db";
import { respond } from "$lib/utils/respond";

import type { RequestHandler } from "./__types/changePassword";

export const post: RequestHandler = async ({ request }) => {
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
			return respond.Error("Incorrect password");
		}

		// validate new password
		if (newPassword.length < 8) {
			return respond.BadRequest("Password must be at least 8 characters");
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

		return respond.Response({ message: "Password updated successfully" });
	} catch (err) {
		assertIsError(err);

		console.error(err);

		return respond.InternalServerError();
	}
};
