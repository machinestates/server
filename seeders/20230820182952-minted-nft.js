'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('MintedNfts', [{
      username: 'ease',
      image: 'https://res.cloudinary.com/dn2kx9w9f/image/upload/v1692542035/qna0f8sclsrxefdxqefs.png',
      wallet: 'Bkqx3Jxb2zpmJ6BpWSm3zpdau8XoRPEGwpsZg1N1KXaL',
      address: 'Ay1DrpyR3xdcY68EqjQdWhxW1DZYcPrutk1YL9tNgfnh',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MintedNfts', null, {});
  }
};
