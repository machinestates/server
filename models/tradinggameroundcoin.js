'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TradingGameRoundCoin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models['TradingGameRoundCoin'].belongsTo(models['TradingGameRound'], {
        foreignKey: 'roundId'
      });
    }
  }
  TradingGameRoundCoin.init({
    uuid: DataTypes.UUID,
    roundId: {
      type: DataTypes.INTEGER,
      field: 'roundId'
    },
    gameUuid: DataTypes.UUID,
    coinUuid: DataTypes.UUID,
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    handle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TradingGameRoundCoin',
  });
  return TradingGameRoundCoin;
};