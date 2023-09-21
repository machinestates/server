const TradingGameRound = require('../models').TradingGameRound;

void async function() {
  try {
    console.log(await TradingGameRound.getEarnings());
  } catch (error) {
    console.log(error);
  }
}();