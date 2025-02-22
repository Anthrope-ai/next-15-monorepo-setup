export class CustomError extends Error {
  name: string;
  message: string;
  statusCode: number;

  constructor(message: string, name: string, statusCode: number) {
    super();
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message?: string) {
    const fallbackMessage = "Access Denied";
    super(message || fallbackMessage, "UnauthorizedError", 401);
  }
}

export class NotFoundError extends CustomError {
  constructor(message?: string) {
    const fallbackMessage = "Resource Not Found";
    super(message || fallbackMessage, "Not Found", 404);
  }
}
