'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TradingGameRounds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID
      },
      handle: {
        type: Sequelize.STRING
      },
      profileImage: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.INTEGER
      },
      lastDay: {
        type: Sequelize.INTEGER
      },
      story: {
        type: Sequelize.TEXT
      },
      storyImage: {
        type: Sequelize.STRING
      },
      storyAudio: {
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
    await queryInterface.dropTable('TradingGameRounds');
  }
};