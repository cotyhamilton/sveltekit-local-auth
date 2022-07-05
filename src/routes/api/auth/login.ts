import bcrypt from "bcrypt";
import * as cookie from "cookie";

import { prisma } from "$lib/common/db";
import { HTTPError } from "$lib/common/httpErrors";
import { respond } from "$lib/common/respond";

import type { RequestHandler } from "./__types/login";

export const post: RequestHandler = async ({ request }) => {
	try {
		const { email, password, remember } = await request.json();

		// get user
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			return respond.Error({ message: "Incorrect email or password" });
		}

		// compare password
		if (!(await bcrypt.compare(password, user.password))) {
			return respond.Error({ message: "Incorrect email or password" });
		}

		// create session
		const cookieId = crypto.randomUUID();

		await prisma.session.create({
			data: {
				id: cookieId,
				userId: user.id,
				remember
			}
		});

		// create cookie with session id
		const headers = {
			"Set-Cookie": cookie.serialize("session_id", cookieId, {
				httpOnly: true,
				maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60,
				sameSite: "strict",
				path: "/"
			})
		};

		return respond.Ok({ user: { name: user?.name, email: user?.email } }, { headers });
	} catch (err) {
		if (err instanceof HTTPError) {
			return respond.Error(err);
		}
		console.error(err);
		return respond.Error();
	}
};
