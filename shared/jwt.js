require('dotenv').config();

const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const secret = process.env.JWT_SECRET;
const createError = require('http-errors');

/**
 * Passport JWT strategy
 */
const strategy = new passportJWT.Strategy({
  secretOrKey: secret,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken() },
   async (payload, next) => {

  const userId = payload.id;
  if (!userId) return next(createError(401));

  return next(null, payload);
});


/**
 * Generates token using JWT sign method
 * @param {object} payload
 * @param {number|string|boolean} expiresIn
 * @returns {string}
 */
 function generate(payload, expiresIn = false) {
    if (!payload) throw new Error('No payload to generate JWT token.');
    const options = expiresIn ? { expiresIn: expiresIn } : {};
    return jwt.sign(payload, secret, options);
  }

/**
 * Verifies token using JWT verify method
 * @param {string} token
 * @returns {*}
 */
function verify(token) {
    if (!token) throw new Error('No token provided to verify.');
    return jwt.verify(token, secret);
}


module.exports = {
    generate,
    verify,
    strategy
}