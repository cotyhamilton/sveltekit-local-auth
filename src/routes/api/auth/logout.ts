import type { RequestHandler } from "./__types/logout";
import { prisma } from "$lib/utils/db";
import * as cookie from "cookie";

export const get: RequestHandler = async ({ request: { headers } }) => {
	try {
		const cookies = cookie.parse(headers.get("cookie") || "");

		// delete session
		if (cookies.session_id) {
			await prisma.session.delete({
				where: {
					id: cookies.session_id
				}
			});
		}
	} catch (err) {
		console.error(err);
	}
	// delete cookie and redirect home
	return {
		status: 302,
		headers: {
			"Set-Cookie": cookie.serialize("session_id", "", {
				path: "/",
				expires: new Date(0)
			}),
			location: "/"
		}
	};
};
