import bcrypt from "bcrypt";
import * as cookie from "cookie";

import { prisma } from "$lib/common/db";
import { BadRequestException, HTTPError } from "$lib/common/httpErrors";
import { respond } from "$lib/common/respond";

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
			return respond.Error({ message: "Email is not available" });
		}

		// validate password
		if (password.length < 8) {
			throw new BadRequestException("Password must be at least 8 characters");
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

		return respond.Ok({ user: { name: user.name, email: user.email } }, { status: 201, headers });
	} catch (err) {
		if (err instanceof HTTPError) {
			return respond.Error(err);
		}
		console.error(err);
		return respond.Error();
	}
};
