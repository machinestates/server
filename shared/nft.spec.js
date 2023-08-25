const { setMetadata } = require('./nft');

describe('Nft', () => {

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