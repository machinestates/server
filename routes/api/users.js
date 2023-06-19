const express = require('express');
const router = express.Router();
const createError = require('http-errors');

/**
 * @route POST api/users
 * @author Ease <ease@machinestates.com>
 */
router.post('/', async (req, res, next) => {
  const user = req.body.user;

  try {
    user.token = '123456789';
    user.id = 1;
    return res.json({ user: {
      id: user.id, email: user.email, token: user.token, username: user.username
    } });
  } catch (error) {
    return next(createError(500, error.message));
  }
});

module.exports = router;
