const { getByUsername } = require('./minted-nft');
const MintedNft = require('../models').MintedNft;

describe('MintedNft', () => {

  describe('getByUsername()', () => {
    test('should retrieve a record by username', async () => {
      const username = 'ease';

      jest
      .spyOn(MintedNft, 'findOne')
      .mockImplementationOnce(() => {
        return {
          username: 'ease'
        }
      });

      const result = await getByUsername(username);

      expect(result.username).toBe('ease');
    });
  });

});