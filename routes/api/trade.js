const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const passport = require('passport');

const User = require('../../shared/user');
const Game = require('../../shared/game');

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) return next(createError(401));

  try {
    const user = await User.getById(userId);
    const game = new Game(user.username);

    return res.json({ game });

  } catch (error) {
    return next(createError(500, error.message));
  }
});

/**
 * @route GET api/trade/scores
 * @author Ease <ease@machinestates.com>
 */
router.get('/scores', async (req, res, next) => {
  try {
    const scores = {
      today: generateScores('ease').sort((a, b) => b.score - a.score),
      alltime: generateScores('scoe').sort((a, b) => b.score - a.score)
    }
    return res.json({ scores });
  } catch (error) {
    return next(createError(500, error.message));
  }
});

function generateScores(handle) {
  const scores = [];
  for (let i = 0; i < 25; i++) {
    scores.push({
      handle: handle,
      score: generateRandomScore(),
      avatar: '',
      top: true
    });
  }
  return scores;
}

function generateRandomScore() {
  return Math.floor(Math.random() * 1000000);
}

module.exports = router;
