import type { ResponseHeaders } from "@sveltejs/kit/types/private";

import { InternalServerError } from "./httpErrors";

export const respond = {
	Ok: function <Type>(
		data: Type,
		{ status, headers }: { status?: number; headers?: ResponseHeaders } = { status: 200 }
	) {
		return {
			status,
			body: {
				data
			},
			headers
		};
	},
	Error: function (
		err: { name?: string; status?: number; message?: string } = {
			...new InternalServerError()
		},
		headers?: ResponseHeaders
	) {
		const { name = "UnknownError", status = 200, message = "Something Went Wrong" } = err;

		return {
			status,
			body: {
				data: null,
				error: {
					name,
					status,
					message
				}
			},
			headers
		};
	}
};
