'use strict';

const { v4 }= require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Items', [
      {
        name: 'Hardware Wallet',
        uuid: v4(),
        description: 'A hardware wallet doubles the capacity of coins that a player can store in TRADING SIMULATION.',
        imageSource: 'https://s3.amazonaws.com/cache-item-images/item-hardware-wallet-med.png',
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
        name: 'Ghost Jacket',
        uuid: v4(),
        description: 'GHOST JACKET makes a player unhackable for a round of the TRADING SIMULATION.',
        imageSource: 'https://s3.amazonaws.com/cache-item-images/item-ghost-jacket-med.png',
        transferable: true,
        price: 1,
        forSale: true,
        equippable: true,
        usable: false,
        rarity: 'common',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Deck Jack',
        uuid: v4(),
        description: 'DECK JACK transfers the money to a player that is hacked from another player during a round of TRADING SIMULATION.',
        imageSource: 'https://s3.amazonaws.com/cache-item-images/item-deck-jack-med.png',
        transferable: true,
        price: 5,
        forSale: true,
        equippable: false,
        usable: true,
        rarity: 'common',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Extended Trip',
        uuid: v4(),
        description: 'Extended Trip is a drug that when taken gives the player an extra day in a round of TRADING SIMULATION.',
        imageSource: 'https://s3.amazonaws.com/cache-item-images/item-extended-trip-med.png',
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
        name: 'Cyberdiesel',
        uuid: v4(),
        description: 'Cyberdiesel is a drug when taken allows the player unlimited exchange jumps in 30 seconds within the same day.',
        imageSource: 'https://s3.amazonaws.com/cache-item-images/item-cyberdiesel-med.png',
        transferable: true,
        price: 5,
        forSale: true,
        equippable: true,
        usable: false,
        rarity: 'common',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bag of Fiat',
        uuid: v4(),
        description: 'Adds $50,000 to a player\'s wallet in a round of the TRADING SIMULATION.',
        imageSource: 'https://megacity-item-images.s3.amazonaws.com/item-bag-of-fiat-med.png',
        transferable: true,
        price: 5,
        forSale: true,
        equippable: true,
        usable: false,
        rarity: 'common',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
      timestamps: true
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Items', null, {});
  }
};
