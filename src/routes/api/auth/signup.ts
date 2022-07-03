import bcrypt from "bcrypt";
import * as cookie from "cookie";

import { assertIsError } from "$lib/utils/assertions";
import { prisma } from "$lib/utils/db";
import { respond } from "$lib/utils/respond";

import type { RequestHandler } from "./__types/signup";

export const post: RequestHandler = async ({ request }) => {
	try {
		const { name, email, password, remember } = await request.json();

		// check if email is in use
		const isEmailUsed = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (isEmailUsed) {
			return respond.Error("Email is not available");
		}

		// validate password
		if (password.length < 8) {
			return respond.BadRequest("Password must be at least 8 characters");
		}

		// hash password
		const hash = await bcrypt.hash(password, 10);

		// create user
		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hash
			}
		});

		// create session
		const cookieId = crypto.randomUUID();

		await prisma.session.create({
			data: {
				id: cookieId,
				userId: user.id,
				remember
			}
		});

		const headers = {
			"Set-Cookie": cookie.serialize("session_id", cookieId, {
				httpOnly: true,
				maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60,
				sameSite: "strict",
				path: "/"
			})
		};

		return respond.Response(
			{ user: { name: user.name, email: user.email } },
			{ status: 201, headers }
		);
	} catch (err) {
		assertIsError(err);

		console.error(err);

		return respond.InternalServerError();
	}
};
