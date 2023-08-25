'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MintedNft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MintedNft.init({
    username: DataTypes.STRING,
    image: DataTypes.STRING,
    wallet: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MintedNft',
  });
  return MintedNft;
};