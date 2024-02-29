'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TradingGameRound extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models['TradingGameRound'].hasMany(models['TradingGameRoundCoin'], { as: 'coins', foreignKey: 'roundId' });
    }
  }

  TradingGameRound.getRoundsCount = async (days) => {
    const query = `SELECT DATE(createdAt) AS date_only, COUNT(*) AS count FROM TradingGameRounds GROUP BY date_only ORDER BY date_only DESC LIMIT ${days}`;
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

  }

  TradingGameRound.getTrader = async (handle) => {
    const query = `
      SELECT 
      handle,
      MAX(profileImage) AS profileImage, 
      SUM(score) AS totalEarnings,
      COUNT(id) AS totalRounds,
      (SELECT createdAt FROM TradingGameRounds WHERE handle = :handle ORDER BY score DESC LIMIT 1) AS createdAt, 
      (SELECT story FROM TradingGameRounds WHERE handle = :handle ORDER BY score DESC LIMIT 1) AS story, 
      (SELECT storyAudio FROM TradingGameRounds WHERE handle = :handle ORDER BY score DESC LIMIT 1) AS storyAudio, 
      (SELECT score FROM TradingGameRounds WHERE handle = :handle ORDER BY score DESC LIMIT 1) AS score 
      FROM TradingGameRounds WHERE handle = :handle LIMIT 1`;
    return sequelize.query(query, { replacements: { handle }, type: sequelize.QueryTypes.SELECT });
  }

  TradingGameRound.getEarnings = async () => {
    const query = 'SELECT handle, MAX(profileImage) AS profileImage, SUM(score) AS totalEarnings FROM TradingGameRounds GROUP BY handle ORDER BY totalEarnings DESC LIMIT 25';
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }

  TradingGameRound.init({
    uuid: DataTypes.UUID,
    handle: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    score: DataTypes.INTEGER,
    lastDay: DataTypes.INTEGER,
    story: DataTypes.TEXT,
    storyImage: DataTypes.STRING,
    storyAudio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TradingGameRound',
  });
  return TradingGameRound;
};