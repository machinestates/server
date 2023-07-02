const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const passport = require('passport');

const User = require('../../shared/user');
const JWT = require('../../shared/jwt');
const Password = require('../../shared/password');
const UserItem = require('../../shared/user-item');

/**
 * @route POST api/users
 * @author Ease <ease@machinestates.com>
 */
router.post('/', async (req, res, next) => {
  const user = req.body.user;
  const { email, password } = user;

  // Transforms to lower case and removes all white space:
  const username = User.format(user.username);

  if (!email) return next(createError(400, 'Email is not set'));
  if (!username) return next(createError(400, 'Username is not set'));
  if (!password) return next(createError(400, 'Password is not set'));

    // Check password length and strength:
    if (Password.strength(password).id < 1) {
      return next(createError(400, 'Password is not strong enough'));
    }
  
    // Check username:
    const usernameExists = await User.usernameExists(username);
    if (usernameExists) return next(createError(401, 'The requested username is unavailable'));
  
    // Check email:
    const emailExists = await User.emailExists(email);
    if (emailExists) return next(createError(401, 'The email address is already in use'));

    try {
      // Create user and return:
      const hashed = await Password.generateHash(password);
      const user = await User.create(username, email, hashed);
  
      user.token = JWT.generate(
        { id: user.id, email: user.email }, '60d'
      );
      return res.json({ user: User.getUserProperties(user) });
    } catch (error) {
      return next(createError(500, error.message));
    }
});

/**
 * @route POST api/users/me
 * @author Ease <ease@machinestates.com>
 */
router.post('/me', async (req, res, next) => {
  const body = req.body.user;
  const { emailusername, password } = body;

  if (!emailusername) return next(createError(400));
  if (!password) return next(createError(400));

  try {
    // Get user:
    const user = await User.getByEmailOrUsername(emailusername);

    // If user does not exist:
    if (!user) return next(createError(404, 'Incorrect username/email and/or password.'));

    const hash = user.password;
    if (await Password.verify(password, hash)) {
      // Success:
      user.token = JWT.generate({ id: user.id, email: user.email }, '60d');
      return res.json({ user: User.getUserProperties(user)  });
    } else {
      return next(createError(404, 'Incorrect username/email and/or password.'));
    }
    } catch (error) {
      return next(error);
    }
});

/**
 * @route GET /api/users/me
 * @author Ease <ease@machinestates.com>
 */
router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) return next(createError(401));

  try {
    const user = await User.getById(userId);
    return res.json({
      user: {
        ...User.getUserProperties(user.dataValues),
        token: req.headers.authorization.replace('Bearer ', ''),
      }
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
});

/**
 * @route GET /api/users/me/items
 * @author Ease <ease@machinestates.com>
 */
router.get('/me/items', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) return next(createError(401));

  try {
    const items = await UserItem.getItems(userId);
    return res.json({ items });
  } catch (error) {
    return next(createError(500, error.message));
  }
});

/**
 * @route GET /api/users/me/items/:uuid
 * @author Ease <ease@machinestates.com>
 */
router.put('/me/items/:uuid', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) return next(createError(401));

  const uuid = req.params.uuid;
  if (!uuid) return next(createError(400, 'UUID is not set'));
  
  const { equipped } = req.body;

  try {

    // Find, update and save item:
    const item = await UserItem.getByUuid(uuid, userId);
    item.equipped = equipped;
    await item.save();

    // Return all items:
    const items = await UserItem.getItems(userId);
    return res.json({ items });
  } catch (error) {
    return next(createError(500, error.message));
  }
});

module.exports = router;
