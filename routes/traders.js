const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const TradingGameRound = require('../models').TradingGameRound;
const moment = require('moment');

router.get('/:trader', async (req, res, next) => {

  const traderName = decodeURIComponent(req.originalUrl.split('/')[2]).replaceAll('-', ' ');
  let trader = await TradingGameRound.getTrader(traderName);

  try {
    if (!trader) {
      return next(createError(404, 'This trader was not found.'));
    }

    trader = trader[0];
    const story = trader.story.replace(/\n/g, "<br />");
    const formattedTime = moment(trader.createdAt).format('MMMM Do YYYY');
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

    const formattedTotalEarnings = formatter.format(trader.totalEarnings);
    const formattedScore = formatter.format(trader.score);

    const averageScore = formatter.format(trader.totalEarnings / trader.totalRounds);

    const data = { 
      ...trader,
      story,
      formattedTime,
      formattedTotalEarnings,
      formattedScore,
      averageScore,
      title: trader.handle,
      description: `${traderName} has earned $${trader.formattedTotalEarnings} in the TRADING SIMULATION.`,
      image: trader.profileImage,
      layout: 'silicon.hbs' 
    };

    return res.render('trader', data);
  } catch (error) {
    console.log(error);
    return res.render('error');
  }
});

module.exports = router;
