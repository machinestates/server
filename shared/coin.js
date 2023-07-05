const TradingGameRoundCoin = require('../models').TradingGameRoundCoin;
const UserCoin = require('../shared/user-coin');

/**
 * 
 * @param {*} round 
 * @param {*} user
 * @param {*} coins 
 * @returns 
 */
async function mint(round, user, coins) {
  if (!round) throw new Error('No round provided');
  if (!user) throw new Error('No user provided');
  if (!coins) throw new Error('No coins provided');

  const { v4 } = require('uuid');

  const minted = [];

  for (const coin of coins) {
    const roundCoin = await TradingGameRoundCoin.create({
      uuid: v4(),
      roundId: round.id,
      gameUuid: round.uuid,
      coinUuid: coin.uuid,
      name: coin.name,
      amount: coin.amount,
      handle: user.username
    });

    // Add or update coin for player:
    const userCoin = await UserCoin.addOrUpdate(user, round, coin);

    minted.push({ round: roundCoin, user: userCoin });
  }
  
  return minted;
}

module.exports = {
  mint,
}