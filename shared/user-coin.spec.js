const { addOrUpdate, getCoins } = require('./user-coin');
const UserCoin = require('../models').UserCoin;

describe('addOrUpdate()', () => {
  test('should mint a new coin for a user', async () => {
    const user = { id: 1 };
    const coin = { uuid: '1234', name: 'CACHE', amount: 50 };
    const round = { id: 1, uuid: '1234' };

    jest
    .spyOn(UserCoin, 'findOne')
    .mockImplementationOnce(() => {
      return null;
    });

    jest
    .spyOn(UserCoin, 'create')
    .mockImplementationOnce(() => {
      return {
        amount: 50
      }
    });

    const result = await addOrUpdate(user, round, coin);
    expect(result.amount).toBe(50);
  });
});

describe('getCoins()', () => {
  test('should retrieve coins for a user', async () => {
    const userId = 1;
    const coins = [
      { name: 'CACHE', amount: 50 },
      { name: 'SPECTR', amount: 100 }
    ];

    jest
    .spyOn(UserCoin, 'findAll')
    .mockImplementationOnce(() => {
      return coins;
    });

    const result = await getCoins(userId);
    expect(result.length).toBe(2);
  });
});