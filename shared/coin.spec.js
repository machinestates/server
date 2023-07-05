const Coin = require('./coin');
const TradingGameRoundCoin = require('../models').TradingGameRoundCoin;
const UserCoin = require('./user-coin');

describe('Coin', () => {

  describe('mint()', () => {
    test('should mint a coin for a round', async () => {
      const round = { id: 1, uuid: '1234' };
      const coins = [{ uuid: '1234', name: 'CACHE', amount: 50 }];
      const user = { username: 'ease', id: 1 };

      jest
      .spyOn(TradingGameRoundCoin, 'create')
      .mockImplementationOnce(() => {
        return {
          roundId: round.id,
          gameUuid: round.uuid
        }
      });

      jest
      .spyOn(UserCoin, 'addOrUpdate')
      .mockImplementationOnce(() => {
        return {
          amount: 50
        }
      });

      const result = await Coin.mint(round, user, coins);
      console.log(result);

      expect(result[0].round.roundId).toBe(1);
      expect(result[0].round.gameUuid).toBe('1234');
    });
  });

});