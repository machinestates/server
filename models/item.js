'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Item.init({
    uuid: DataTypes.UUID,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    imageSource: DataTypes.STRING,
    transferable: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    forSale: DataTypes.BOOLEAN,
    usable: DataTypes.BOOLEAN,
    equippable: DataTypes.BOOLEAN,
    rarity: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};