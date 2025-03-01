const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const coins = require('../data/coins').coins;
const { getPrice } = require('../shared/birdeye');

router.get('/:coin', async (req, res, next) => {

  const params = req.params;
  const coin = coins.find(coin => coin.name.toLowerCase() === params.coin.toLowerCase());

  try {
    if (!coin) {
      return next(createError(404, 'This coin was not found.'));
    }

    const price = coin.tokenAddress ? await getPrice(coin.tokenAddress) : undefined;

    const data = { 
      ...coin,
      title: coin.name,
      description: coin.description,
      image: coin.image,
      price: price,
      layout: 'silicon.hbs' 
    };

    return res.render('coin', data);
  } catch (error) {
    console.log(error);
    return res.render('error');
  }
});

module.exports = router;
