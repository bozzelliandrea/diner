const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Create a hashed password with the string password value and the salt.
 * @private
 * @param password clear password in string format
 * @param salt generated salt for hashing.
 * @returns {string} hash.
 */
function _hash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString('hex');
}

/**
 * Create and sign a session and return a valid JWT token with username and user role encoded in payload.
 *
 * @param username application required payload component.
 * @param role application required payload component.
 * @returns {string} Encoded JWT.
 */
function getToken(username, role) {
    return jwt.sign(
        {username, role},
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_VALIDITY + "s"
        })
}

/**
 * Given the clear password, generate a random salt and then hash the input password.
 *
 * @param password clear password in string format.
 * @returns {{salt: string, hash: string}}
 */
function hashPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex")

    return {
        salt: salt,
        hash: _hash(password, salt)
    }
}

/**
 * Validate the saved password hash with the one received in input.
 *
 * @param savedHash the current user password (saved or persisted) in hash format.
 * @param password the received password in string format, entered by the user.
 * @param salt generated with the registration, unique for the password hashing.
 * @returns {boolean} true if the passwords are equals.
 */
function validatePassword(savedHash, password, salt) {
    return savedHash === _hash(password, salt)
}

module.exports = {
    getToken,
    hashPassword,
    validatePassword
}