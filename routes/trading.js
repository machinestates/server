const express = require('express');
const router = express.Router();
var createError = require('http-errors');
const moment = require('moment');

const TradingGameRound = require('../models').TradingGameRound;

router.get('/:uuid', async (req, res, next) => {

  const params = req.params;

  try {
    const round = await TradingGameRound.findOne({
      where: {
        uuid: params.uuid
      }
    });

    if (!round) {
      return next(createError(404));
    }

    const story = round.story.replace(/\n/g, "<br />");
    const formattedTime = moment(round.createdAt).format('MMMM Do YYYY, h:mm:ss a');

    const data = { ...round.dataValues, story, formattedTime, title: 'Trading Round', layout: 'layout-silicon.hbs' };
    console.log(data);

    return res.render('round', data);
  } catch (error) {
    console.log(error);
    return res.render('error');
  }
});

module.exports = router;
