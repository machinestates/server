const User = require('../models').User;
const TradingGameRound = require('../models').TradingGameRound;
/**
 * Retrieves a user's profile by their handle
 * @param {string} handle 
 */
async function getByHandle(handle) {
    const profile = await User.findOne({
        attributes: ['username', 'bio', 'avatar'],
        where: { username: handle }
    });
    const totalEarnings = await TradingGameRound.sum('score', { where: { handle } });
    const rounds = await TradingGameRound.findAll({
      where: { handle },
      limit: 5,
      order: [['score', 'DESC']]
    });
    return { profile, rounds, totalEarnings }
}

module.exports = {
    getByHandle
}