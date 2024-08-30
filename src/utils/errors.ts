export class BaseError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class ServiceError extends BaseError {
  constructor(message: string) {
    super(message, 400); // Use 400 for service errors by default
  }
}

export class InternalError extends BaseError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class ForbiddenError extends ServiceError {
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export class UnAuthenticatedError extends ServiceError {
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class BadRequestError extends ServiceError {
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class InternalServerError extends InternalError {
  constructor(message: string) {
    super(message);
  }
}
