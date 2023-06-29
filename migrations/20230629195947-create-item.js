'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      imageSource: {
        type: Sequelize.STRING
      },
      transferable: {
        type: Sequelize.BOOLEAN
      },
      price: {
        type: Sequelize.INTEGER
      },
      forSale: {
        type: Sequelize.BOOLEAN
      },
      usable: {
        type: Sequelize.BOOLEAN
      },
      equippable: {
        type: Sequelize.BOOLEAN
      },
      rarity: {
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
    await queryInterface.dropTable('Items');
  }
};