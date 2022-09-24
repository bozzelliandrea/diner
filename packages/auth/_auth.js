const fakeMongo = new Map();
const core = require('../core/index');
const {hashPassword, validatePassword, getToken} = require('./_auth-utils');
const {decode} = require('jsonwebtoken');

async function register(username, email, password) {
    if (!email || !username || !password)
        throw new core.appError(core.httpCode.BAD_REQUEST, "Registration required parameter cannot be null");

    let user = fakeMongo.get(username);

    if (user)
        throw new core.appError(core.httpCode.CONFLICT, "User already exist");

    const {salt, hash} = hashPassword(password);

    user = {username, email, hash, salt}

    try {
        fakeMongo.set(username, user);
    } catch (err) {
        throw new core.appError(core.httpCode.UNPROCESSABLE_ENTITY, "Failed to save user");
    }

    return new core.appResponse(core.httpCode.CREATED, {username}, getToken(username, "USER"));
}

async function login(username, password) {
    if (!username || !password)
        throw new core.appError(core.httpCode.BAD_REQUEST, "Login required parameter cannot be null");

    const user = fakeMongo.get(username);

    if (!user)
        throw new core.appError(core.httpCode.UNAUTHORIZED, "The user does not exist")

    if(!validatePassword(user.hash, password, user.salt))
        throw new core.appError(core.httpCode.UNAUTHORIZED, "Wrong password")

    return new core.appResponse(null, null, getToken(username, "USER"));
}

async function refresh(token) {
    if (!token)
        throw new core.appError(core.httpCode.BAD_REQUEST, "Token not found");

    const decoded = decode(token);

    if (!fakeMongo.get(decoded.username))
        throw new core.appError(core.httpCode.UNAUTHORIZED, "The user does not exist")

    return new core.appResponse(null, {username: decoded.username}, getToken(decoded.username, decoded.role));
}

module.exports = {
    register,
    login,
    refresh
}