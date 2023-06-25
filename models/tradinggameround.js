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
      // define association here
    }
  }
  TradingGameRound.init({
    uuid: DataTypes.UUID,
    handle: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    score: DataTypes.INTEGER,
    coins: DataTypes.INTEGER,
    lastDay: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TradingGameRound',
  });
  return TradingGameRound;
};