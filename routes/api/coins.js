const path = require('path');
require('dotenv').config();

const express = require('express');
const router = express.Router();
const passport = require('passport');
const createError = require('http-errors');

const coins = require('../../data/game').coins;

router.get('/', async (request, response, next) => {
  try {
    return response.json({ results: coins });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
});

module.exports = router;