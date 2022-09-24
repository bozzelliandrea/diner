const fakeMongo = new Map();
const core = require('../core/index');
const {hashPassword} = require('./_auth-utils');

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

    return user;
}

async function login() {
}

async function refresh() {
}

module.exports = {
    register,
    login,
    refresh
}