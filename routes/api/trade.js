const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const passport = require('passport');
const _ = require('lodash');
const moment = require('moment');

const User = require('../../shared/user');
const Game = require('../../shared/game');
const GameExchange = require('../../dtos/game-exchange');
const Redis = require('../../shared/redis');
const { Op } = require('sequelize');

const TradingGameRound = require('../../models').TradingGameRound;

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) return next(createError(401));

  const publicKey = req.body.publicKey;
  const handle = req.body.handle;
  const image = req.body.image;

  try {
    const game = new Game(handle, image, publicKey);
    game.exchanges = _.map(game.exchanges, exchange => { return new GameExchange(exchange) });
    
    // Get initial inventory:
    game.inventory.items = await Game.getInitialInventory(userId);

    // Set initial game state:
    await Redis.setGameState(game.uuid, JSON.stringify([game]));
    return res.json({ game });

  } catch (error) {
    console.log(error);
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
    const today = await TradingGameRound.findAll({
      limit: 25,
      order: [['score', 'DESC']],
      where: {
        createdAt: {
          [Op.gte]: new Date().setHours(0,0,0,0)
        }
      }
    });
    const alltime = await TradingGameRound.findAll({
      limit: 25,
      order: [['score', 'DESC']],
    });

    const earnings = await TradingGameRound.getEarnings();
    
    const scores = {
      today,
      alltime,
      earnings
    }
    return res.json({ scores });
  } catch (error) {
    return next(createError(500, error.message));
  }
});

module.exports = router;
