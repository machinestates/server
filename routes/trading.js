const express = require('express');
const router = express.Router();
var createError = require('http-errors');

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

    const data = { ...round.dataValues, story, title: 'Trading Round' };
    console.log(data);

    return res.render('round', data);
  } catch (error) {
    console.log(error);
    return res.render('error');
  }
});

module.exports = router;
