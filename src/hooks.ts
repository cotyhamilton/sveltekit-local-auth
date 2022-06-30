import type { Handle, GetSession } from "@sveltejs/kit";
import * as cookie from "cookie";
import { getUserFromSession } from "$lib/utils/db";

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get("cookie") || "");

	// get user from session in cookie
	if (cookies.session_id) {
		try {
			const user = await getUserFromSession(cookies.session_id);
			if (user) {
				event.locals.user = {
					name: user.name,
					email: user.email
				};
			} else {
				event.locals.user = null;
			}
		} catch (err) {
			// user had invalid session id in cookie
			console.error(err);
		}
	}

	return await resolve(event);
};

export const getSession: GetSession = ({ locals }) => {
	return {
		user: locals.user && {
			name: locals.user.name,
			email: locals.user.email
		}
	};
};
