const User = require('../models').User;
const { v4: uuidv4 } = require('uuid');
const isEmail = require('is-email');

const reservedUsernames = require('./reserved-usernames');

/**
 *
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns
 */
async function create(username, email, password) {
  if (!username) throw new Error('No username provided.');
  if (!password) throw new Error('No password provided.');

  return await User.create({
      uuid: uuidv4(),
      username,
      email,
      password
  });
}

/**
 * Formats to spec: no spaces, all lowercase
 * @param {string} username
 */
function format(username) {
  if (!username) return '';
  if (typeof username !== 'string') return '';
  return username
      .toLowerCase()
      .replace(/\s/g,'')
      .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}

/**
 * Returns true if user with email exists
 * @param {string} email
 */
async function emailExists(email) {
  if (!email) throw new Error('No email provided.');

  const user = await User.findOne({
      where: { email: email }
  });
  return user ? true : false;
}

/**
 * Retrieve basic user information by id
 * @param {*} id 
 * @returns 
 */
async function getById(id) {
  return await User.findOne({
      attributes: [
        'id', 'username', 'email'
      ],
      where: { id }
  });
}

async function getByEmailOrUsername(emailOrUsername) {
  if (isEmail(emailOrUsername)) {
    return await User.findOne({
      where: { email: emailOrUsername }
    });
  } else {
    return await User.findOne({
      where: { username: format(emailOrUsername) }
    });
  }
}

/**
 * Returns true if user with username exists
 * @param {string} username
 */
 async function usernameExists(username) {
  if (!username) throw new Error('No username provided.');

  // Do not allow registration of reserved usernames:
  if (reservedUsernames.includes(username)) {
      return true;
  }

  const user = await User.findOne({
      where: { username: username }
  });
  return user ? true : false;
}

/**
 *
 * @param {string} username
 * @returns
 */
async function remove(username) {
  if (!username) throw new Error('No username provided.');
  return await User.destroy({ where: { username } })
}

module.exports = {
  create,
  format,
  emailExists,
  usernameExists,
  remove,
  getById,
  getByEmailOrUsername
}