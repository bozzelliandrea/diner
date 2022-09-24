const httpCode = require("./http-code");

class AppError extends Error {

    constructor(code, message, description) {
        super();

        Error.captureStackTrace(this, this.constructor);

        this.message = message || "Server Error";
        this.code = code || httpCode.INTERNAL_SERVER_ERROR;
        this.description = description;
    }
}

module.exports = AppError;