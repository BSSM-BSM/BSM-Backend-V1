class HttpError extends Error {
    code: number;
    constructor(message?: string) {
        super();
        this.code = 500;
        this.message = 'Internal Server Error';
        if(this instanceof BadRequestException){
            this.code = 400;
            this.message = 'Bad Request';
        }
        if(this instanceof UnAuthorizedException){
            this.code = 401;
            this.message = 'Unauthorized';
        }
        if(this instanceof ForbiddenException){
            this.code = 403;
            this.message = 'Forbidden';
        }
        if(this instanceof NotFoundException){
            this.code = 404;
            this.message = 'Not Found';
        }
        if(this instanceof ConflictException){
            this.code = 409;
            this.message = 'Conflict';
        }
        if(this instanceof InternalServerException){
            this.code = 500;
            this.message = 'Internal Server Error';
        }
        if(typeof message != 'undefined'){
            this.message = message;
        }
    }
}

class BadRequestException extends HttpError {}
class UnAuthorizedException extends HttpError {}
class ForbiddenException extends HttpError {}
class NotFoundException extends HttpError {}
class ConflictException extends HttpError {}
class InternalServerException extends HttpError {}

export {
    BadRequestException,
    UnAuthorizedException,
    ForbiddenException,
    NotFoundException,
    ConflictException,
    InternalServerException
}