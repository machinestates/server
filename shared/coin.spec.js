const { mint } = require('./coin'); // Replace with your actual module path
const { TradingGameRoundCoin } = require('../models');
const UserCoin = require('../shared/user-coin');
const { v4 } = require('uuid');

jest.mock('../models');
jest.mock('../shared/user-coin');
jest.mock('uuid');

describe('Mint Function Tests', () => {
  beforeEach(() => {
    TradingGameRoundCoin.create = jest.fn();
    UserCoin.addOrUpdate = jest.fn();
    v4.mockReturnValue('mocked-uuid');
  });

  it('should throw an error if no round is provided', async () => {
    await expect(mint(null, {}, [])).rejects.toThrow('No round provided');
  });

  it('should throw an error if no user is provided', async () => {
    await expect(mint({}, null, [])).rejects.toThrow('No user provided');
  });

  it('should throw an error if no coins are provided', async () => {
    await expect(mint({}, {}, null)).rejects.toThrow('No coins provided');
  });

  it('should mint coins and return minted coins', async () => {
    const mockRound = { id: 1, uuid: 'round-uuid' };
    const mockUser = { username: 'user1' };
    const mockCoins = [
      { uuid: 'coin-uuid', name: 'coin1', amount: 100 },
    ];

    const mockRoundCoin = {
      uuid: 'mocked-uuid',
      roundId: mockRound.id,
      gameUuid: mockRound.uuid,
      coinUuid: mockCoins[0].uuid,
      name: mockCoins[0].name,
      amount: mockCoins[0].amount,
      handle: mockUser.username,
    };
    const mockUserCoin = { some: 'userCoin' };

    TradingGameRoundCoin.create.mockResolvedValue(mockRoundCoin);
    UserCoin.addOrUpdate.mockResolvedValue(mockUserCoin);

    const minted = await mint(mockRound, mockUser, mockCoins);

    expect(minted).toEqual([{ round: mockRoundCoin, user: mockUserCoin }]);
    expect(TradingGameRoundCoin.create).toHaveBeenCalledWith({
      uuid: 'mocked-uuid',
      roundId: mockRound.id,
      gameUuid: mockRound.uuid,
      coinUuid: mockCoins[0].uuid,
      name: mockCoins[0].name,
      amount: mockCoins[0].amount,
      handle: mockUser.username,
    });
    expect(UserCoin.addOrUpdate).toHaveBeenCalledWith(mockUser, mockRound, mockCoins[0]);
  });
});
