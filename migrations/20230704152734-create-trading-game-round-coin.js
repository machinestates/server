'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TradingGameRoundCoins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID
      },
      roundId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TradingGameRounds',
          key: 'id'
        }
      },
      gameUuid: {
        type: Sequelize.UUID
      },
      coinUuid: {
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      handle: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TradingGameRoundCoins');
  }
};