'use strict';

require('dotenv').config();
const Password = require('../shared/password');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      uuid: '873a9daa-0c78-4258-8e97-8c0d5c1d5e11',
      username: 'ease',
      email: 'erik@erikaugust.com',
      removed: false,
      password: await Password.generateHash(process.env.ENTRY_PASSWORD),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});

  }
};
