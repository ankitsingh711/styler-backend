import { HttpStatus, ErrorCode } from '@common/constants';

/**
 * Base application exception
 */
export class AppException extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
        public readonly errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): Record<string, unknown> {
        return {
            success: false,
            error: {
                code: this.errorCode,
                message: this.message,
                ...(this.details && { details: this.details }),
            },
        };
    }
}

/**
 * Bad Request Exception (400)
 */
export class BadRequestException extends AppException {
    constructor(message = 'Bad Request', details?: unknown) {
        super(message, HttpStatus.BAD_REQUEST, ErrorCode.INVALID_INPUT, details);
    }
}

/**
 * Unauthorized Exception (401)
 */
export class UnauthorizedException extends AppException {
    constructor(message = 'Unauthorized', details?: unknown) {
        super(message, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, details);
    }
}

/**
 * Forbidden Exception (403)
 */
export class ForbiddenException extends AppException {
    constructor(message = 'Forbidden', details?: unknown) {
        super(message, HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, details);
    }
}

/**
 * Not Found Exception (404)
 */
export class NotFoundException extends AppException {
    constructor(message = 'Resource not found', details?: unknown) {
        super(message, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, details);
    }
}

/**
 * Conflict Exception (409)
 */
export class ConflictException extends AppException {
    constructor(message = 'Resource already exists', details?: unknown) {
        super(message, HttpStatus.CONFLICT, ErrorCode.ALREADY_EXISTS, details);
    }
}

/**
 * Validation Exception (422)
 */
export class ValidationException extends AppException {
    constructor(message = 'Validation failed', details?: unknown) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_ERROR, details);
    }
}

/**
 * Too Many Requests Exception (429)
 */
export class TooManyRequestsException extends AppException {
    constructor(message = 'Too many requests', details?: unknown) {
        super(message, HttpStatus.TOO_MANY_REQUESTS, ErrorCode.INTERNAL_ERROR, details);
    }
}

/**
 * Internal Server Error Exception (500)
 */
export class InternalServerErrorException extends AppException {
    constructor(message = 'Internal server error', details?: unknown) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, details);
    }
}

/**
 * Database Exception
 */
export class DatabaseException extends AppException {
    constructor(message = 'Database error', details?: unknown) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.DATABASE_ERROR, details);
    }
}

/**
 * External Service Exception
 */
export class ExternalServiceException extends AppException {
    constructor(message = 'External service error', details?: unknown) {
        super(message, HttpStatus.SERVICE_UNAVAILABLE, ErrorCode.EXTERNAL_SERVICE_ERROR, details);
    }
}

/**
 * Payment Exception
 */
export class PaymentException extends AppException {
    constructor(message = 'Payment failed', details?: unknown) {
        super(message, HttpStatus.BAD_REQUEST, ErrorCode.PAYMENT_FAILED, details);
    }
}

/**
 * Invalid Credentials Exception
 */
export class InvalidCredentialsException extends UnauthorizedException {
    constructor(message = 'Invalid credentials') {
        super(message);
        this.errorCode = ErrorCode.INVALID_CREDENTIALS;
    }
}

/**
 * Token Expired Exception
 */
export class TokenExpiredException extends UnauthorizedException {
    constructor(message = 'Token has expired') {
        super(message);
        this.errorCode = ErrorCode.TOKEN_EXPIRED;
    }
}

/**
 * Invalid Token Exception
 */
export class InvalidTokenException extends UnauthorizedException {
    constructor(message = 'Invalid token') {
        super(message);
        this.errorCode = ErrorCode.TOKEN_INVALID;
    }
}
