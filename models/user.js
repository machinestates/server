'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models['User'].hasMany(models['UserItem'], { as: 'items', foreignKey: 'userId' });
      models['User'].hasMany(models['UserCoin'], { as: 'coins', foreignKey: 'userId' });
    }
  }
  User.init({
    uuid: DataTypes.UUID,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    bio: DataTypes.TEXT,
    removed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};