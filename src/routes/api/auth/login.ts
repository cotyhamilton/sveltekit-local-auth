import type { RequestHandler } from "./__types/login";
import bcrypt from "bcrypt";
import { assertIsError } from "$lib/utils/assertions";
import { prisma } from "$lib/utils/db";
import * as cookie from "cookie";

export const post: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();

		// get user
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			return {
				status: 401,
				body: {
					error: "Unauthorized",
					message: "Incorrect email or password"
				}
			};
		}

		// compare password
		if (!(await bcrypt.compare(password, user.password))) {
			return {
				status: 401,
				body: {
					error: "Unauthorized",
					message: "Incorrect email or password"
				}
			};
		}

		// create session
		const cookieId = crypto.randomUUID();

		await prisma.session.create({
			data: {
				id: cookieId,
				userId: user.id
			}
		});

		// create cookie with session id
		const headers = {
			"Set-Cookie": cookie.serialize("session_id", cookieId, {
				httpOnly: true,
				maxAge: 60 * 60,
				sameSite: "strict",
				path: "/"
			})
		};

		return {
			body: {
				user: {
					name: user.name,
					email: user.email
				}
			},
			headers
		};
	} catch (err) {
		assertIsError(err);

		console.error(err);

		return {
			status: 500,
			body: {
				error: "Internal Server Error",
				message: "Something went wrong"
			}
		};
	}
};
