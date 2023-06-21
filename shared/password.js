const bcrypt = require('bcrypt');
const { passwordStrength } = require('check-password-strength');

/**
 * Generates a password hash using bcrypt
 * @param {string} password
 * @returns
 */
 async function generateHash(password) {
    if (!password) throw new Error('No password provided.');
    const rounds = 10;
    return await bcrypt.hash(password, rounds);
}

/**
 * Verifies password is correct given hash
 * @param {string} password
 * @param {string} hash
 * @returns
 */
async function verify(password, hash) {
    return await bcrypt.compare(password, hash);
}

/**
 *
 * @param {string} password
 * @returns {number}
 */
function strength(password) {
    return passwordStrength(password);
}

module.exports = {
    generateHash,
    verify,
    strength
}