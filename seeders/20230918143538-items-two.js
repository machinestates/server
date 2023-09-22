'use strict';

const { v4 } = require('uuid');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Items', [
      {
        name: 'Weed Blunt',
        uuid: v4(),
        description: 'WEED BLUNT allows you to hit the weed and breathe during a game of TRADING SIMULATION.',
        imageSource: '',
        transferable: true,
        price: 3,
        forSale: true,
        equippable: true,
        usable: false,
        rarity: 'common',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Burner',
        uuid: v4(),
        description: 'BURNER is a gun that prevents robbery during a game of TRADING SIMULATION.',
        imageSource: '',
        transferable: true,
        price: 3,
        forSale: true,
        equippable: true,
        usable: false,
        rarity: 'common',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {
      timestamps: true
    });
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {

    return queryInterface.bulkDelete('Items', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
