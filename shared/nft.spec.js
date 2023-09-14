const { setMetadata, getNftsByOwner } = require('./nft');

describe('Nft', () => {

  describe('getNftsByOwner()', () => {
    jest.setTimeout(60000);

    test.only('should return nfts for a user', async () => {
      const address = 'GeXu4GpEaSogZ16uzGB6QQwevVYNSNy1seKiTRckFMYt';
      const result = await getNftsByOwner(address);
      expect (result.length).toBeTruthy();
      console.log(result);
    });
  });

  describe('setMetadata()', () => {
    test('should correcly set metadata', async () => {
      const username = 'ease';
      const image = 'https://res.cloudinary.com/dn2kx9w9f/image/upload/v1692199168/mqvyomgrdevsiu4mjckl.gif';

      const result = setMetadata(username, image);

      expect(result.name).toBe(username);
      expect(result.image).toBe(image);
      expect(result.symbol).toBe('MS');
    });
  });

});