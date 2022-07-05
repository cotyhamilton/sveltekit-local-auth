export class HTTPError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		this.message = message;
	}
}

export class NotFoundException extends HTTPError {
	constructor(message = "Not Found", status = 404) {
		super(message, status);
		this.name = "NotFoundError";
		this.status = status;
		this.message = message;
	}
}

export class BadRequestException extends HTTPError {
	constructor(message = "Bad Request", status = 400) {
		super(message, status);
		this.name = "BadRequestError";
		this.status = status;
		this.message = message;
	}
}

export class InternalServerError extends HTTPError {
	constructor(message = "Internal Server Error", status = 500) {
		super(message, status);
		this.name = "InternalServerError";
		this.status = status;
		this.message = message;
	}
}
