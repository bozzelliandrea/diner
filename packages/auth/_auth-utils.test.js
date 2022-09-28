const utils = require('./_auth-utils');
const jwt = require('jsonwebtoken');

const test_user = {
    username: "foo",
    email: 'foo@hooly.com',
    password: "theSecretPassword",
    role: "USER"
}

describe('auth utils', function () {
    it('hash password', () => {
        const {salt, hash} = utils.hashPassword(test_user.password);

        test_user.salt = salt;
        test_user.hash = hash;
        expect(hash).not.toBe(test_user.password);
    })
    it('validate password after salt generation', () => {
        const result = utils.validatePassword(test_user.hash, test_user.password, test_user.salt);

        expect(result).toBeTruthy();
    })
    it('validate with wrong password, should fail', () => {
        const result = utils.validatePassword(test_user.hash, "theWrongPassword", test_user.salt);

        expect(result).toBeFalsy();
    })
    it('generate a new JWT', () => {
        const token = utils.getToken(test_user.username, test_user.role);

        expect(token).not.toBeNull();
        expect(token).not.toBeUndefined();

        jwt.verify(token, process.env.TOKEN_SECRET, {}, (error, decoded) => {
            expect(decoded).not.toBeNull();
            expect(decoded).toHaveProperty("username")
            expect(decoded).toHaveProperty("role")
            expect(decoded.username).toBe(test_user.username);
            expect(decoded.role).toBe(test_user.role);
        });
    })
});

module.exports = { test_user }