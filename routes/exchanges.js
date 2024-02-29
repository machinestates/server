const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const slugify = require('slugify');

const exchanges = require('../data/exchanges').exchanges;

router.get('/:exchange', async (req, res, next) => {

  const params = req.params;
  const exchange = exchanges.find(exchange => slugify(exchange.name, { lower: true }) === params.exchange);

  try {
    if (!exchange) {
      return next(createError(404, 'This exchange was not found.'));
    }

    const data = { 
      ...exchange,
      title: exchange.name,
      description: exchange.description,
      image: exchange.image,
      layout: 'silicon.hbs' 
    };

    return res.render('exchange', data);
  } catch (error) {
    console.log(error);
    return res.render('error');
  }
});

module.exports = router;
