const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const passport = require('passport');
const _ = require('lodash');

const User = require('../../shared/user');
const Game = require('../../shared/game');
const GameExchange = require('../../dtos/game-exchange');
const Redis = require('../../shared/redis');

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) return next(createError(401));

  try {
    const user = await User.getById(userId);
    const game = new Game(user.username);
    game.exchanges = _.map(game.exchanges, exchange => { return new GameExchange(exchange) });
    
    // TODO: Get initial inventory:

    // Set initial game state:
    await Redis.setGameState(game.uuid, JSON.stringify([game]));
    return res.json({ game });

  } catch (error) {
    return next(createError(500, error.message));
  }
});

router.put('/:uuid', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) return next(createError(401));

  const uuid = _.get(req, 'params.uuid');
  if (!uuid) return next(createError(404));

  try {

    // Get current game by UUID:
    let game = await Redis.getGameState(uuid);
    const last = _.last(game);

    // Modify game state based on action:
    const current = await Game.doAction(last, req.body);

    game.push(current);
    await Redis.setGameState(current.uuid, JSON.stringify(game));

    // Return to client:
    current.exchanges = _.map(current.exchanges, exchange => { return new GameExchange(exchange) });
    return res.json({ game: current });
  } catch (error) {
    console.log(error);
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
