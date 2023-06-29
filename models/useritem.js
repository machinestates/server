'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models['UserItem'].belongsTo(models['User'], {
        foreignKey: 'userId'
      });
    }
  }
  UserItem.init({
    uuid: DataTypes.UUID,
    itemUuid: DataTypes.UUID,
    userId: {
      type: DataTypes.INTEGER,
      field: 'userId'
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    imageSource: DataTypes.STRING,
    used: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserItem',
  });
  return UserItem;
};