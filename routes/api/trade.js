const express = require('express');
const router = express.Router();
const createError = require('http-errors');

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
      score: generateScore(),
      avatar: '',
      top: true
    });
  }
  return scores;
}

function generateScore() {
  return Math.floor(Math.random() * 1000000);
}

module.exports = router;
