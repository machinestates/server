const UserCoin = require('../models').UserCoin;

async function addOrUpdate(user, round, coin) {
  if (!user) throw new Error('No user provided');
  if (!coin) throw new Error('No coin provided');

  const existing = await UserCoin.findOne({
    where: {
      userId: user.id,
      coinUuid: coin.uuid
    }
  });

  if (existing) {
    existing.amount += coin.amount;
    await existing.save();
    return existing;
  }

  const { v4 } = require('uuid');
  const roundCoin = await UserCoin.create({
    uuid: v4(),
    roundId: round.id,
    gameUuid: round.uuid,
    coinUuid: coin.uuid,
    name: coin.name,
    amount: coin.amount,
    userId: user.id,
  });

  return roundCoin;
}

async function getCoins(userId) {
  if (!userId) throw new Error('No userId provided');

  return await UserCoin.findAll({
    where: {
      userId
    }
  });
}

module.exports = {
  addOrUpdate,
  getCoins
}