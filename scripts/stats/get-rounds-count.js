// Retrieves the count of completed rounds for the past X days

const { TradingGameRound } = require('../../models');

void async function() {
  const rounds = await TradingGameRound.getRoundsCount(30);

  console.log(rounds);
}();