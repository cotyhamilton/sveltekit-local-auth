import type { ResponseHeaders } from "@sveltejs/kit/types/private";

export const respond = {
	Response: function <Type>(
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
		error = "Something went wrong",
		{ headers }: { headers?: ResponseHeaders } = {}
	) {
		return {
			body: {
				error
			},
			headers
		};
	},
	BadRequest: function (message = "Bad Request", { headers }: { headers?: ResponseHeaders } = {}) {
		return {
			status: 400,
			body: {
				error: "Bad Request",
				message
			},
			headers
		};
	},
	Unauthorized: function (
		message = "Unauthorized",
		{ headers }: { headers?: ResponseHeaders } = {}
	) {
		return {
			status: 401,
			body: {
				error: "Unauthorized",
				message
			},
			headers
		};
	},
	InternalServerError: function (
		message = "Something Went Wrong",
		{ headers }: { headers?: ResponseHeaders } = {}
	) {
		return {
			status: 500,
			body: {
				error: "Internal Server Error",
				message
			},
			headers
		};
	}
};
