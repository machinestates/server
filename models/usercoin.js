'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCoin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models['UserCoin'].belongsTo(models['User'], {
        foreignKey: 'userId'
      });
    }
  }
  UserCoin.init({
    uuid: DataTypes.UUID,
    coinUuid: DataTypes.UUID,
    userId: {
      type: DataTypes.INTEGER,
      field: 'userId'
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    iconImage: DataTypes.STRING,
    description: DataTypes.STRING,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserCoin',
  });
  return UserCoin;
};