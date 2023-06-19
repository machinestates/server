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
      today: [
        { handle: 'ease', score: 100, avatar: '', top: true },
        { handle: 'ease', score: 100, avatar: '', top: true },        { handle: 'ease', score: 100, avatar: '', top: true },
        { handle: 'ease', score: 100, avatar: '', top: true },
        { handle: 'ease', score: 100, avatar: '', top: true },
        { handle: 'ease', score: 100, avatar: '', top: true },
      ],
      alltime: [
        { handle: 'scoe', score: 100, avatar: '', top: true },
        { handle: 'scoe', score: 100, avatar: '', top: true },
        { handle: 'scoe', score: 100, avatar: '', top: true },
        { handle: 'scoe', score: 100, avatar: '', top: false },
        { handle: 'scoe', score: 100, avatar: '', top: false },
      ]
    }
    return res.json({ scores });
  } catch (error) {
    return next(createError(500, error.message));
  }
});

module.exports = router;
