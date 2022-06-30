import type { RequestHandler } from "./__types/signup";
import bcrypt from "bcrypt";
import { assertIsError } from "$lib/utils/assertions";
import { prisma } from "$lib/utils/db";
import * as cookie from "cookie";

export const post: RequestHandler = async ({ request }) => {
	try {
		const { name, email, password } = await request.json();

		// check if email is in use
		const isEmailUsed = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (isEmailUsed) {
			return {
				status: 401,
				body: {
					error: "Unauthorized",
					message: "Email is not available"
				}
			};
		}

		// validate password
		if (password.length < 8) {
			return {
				status: 400,
				body: {
					error: "Bad Request",
					message: "Password must be at least 8 characters"
				}
			};
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
				userId: user.id
			}
		});

		const headers = {
			"Set-Cookie": cookie.serialize("session_id", cookieId, {
				httpOnly: true,
				maxAge: 60 * 60,
				sameSite: "strict",
				path: "/"
			})
		};

		return {
			status: 201,
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
