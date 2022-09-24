const httpCode = require("./http-code");

class AppResponse {
    constructor(code, payload, jwt) {
        this.code = code || httpCode.OK;
        this.payload = payload;
        this.jwt = jwt;
    }
}

module.exports = AppResponse;