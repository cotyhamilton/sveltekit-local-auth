import type { GetSession, Handle } from "@sveltejs/kit";

import type { Session } from "@prisma/client";
import * as cookie from "cookie";

import { prisma } from "$lib/common/db";

export const handle: Handle = async ({ event, resolve }) => {
	const { session_id } = cookie.parse(event.request.headers.get("cookie") || "");
	let session: Session | null = null;
	let isSessionValid = false;

	// session id from cookie
	if (session_id) {
		try {
			// get session
			session = await prisma.session.findUnique({
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
			// set user in svelte session
			if (user) {
				event.locals.user = {
					name: user.name,
					email: user.email
				};
				isSessionValid = true;
			} else {
				event.locals.user = null;
			}
		} catch (err) {
			event.locals.user = null;
		}
	}

	const response = await resolve(event);

	if (isSessionValid && session) {
		// update cookie expiry
		response.headers.set(
			"Set-Cookie",
			cookie.serialize("session_id", session_id, {
				httpOnly: true,
				maxAge: session.remember ? 60 * 60 * 24 * 30 : 60 * 60,
				sameSite: "strict",
				path: "/"
			})
		);
	}

	if (session_id && !isSessionValid) {
		// delete cookie
		response.headers.set(
			"Set-Cookie",
			cookie.serialize("session_id", "", {
				path: "/",
				expires: new Date(0)
			})
		);
	}

	return response;
};

export const getSession: GetSession = ({ locals }) => {
	return {
		user: locals.user && {
			name: locals.user.name,
			email: locals.user.email
		}
	};
};
