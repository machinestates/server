const { v4 } = require('uuid');
const _ = require('lodash');

const GameExchange = require('./game-exchange');
const game = require('../data/game.json');

describe('GameExchange Class', () => {
  
  let mockExchange, mockCoins, mockFiatcoin;

  beforeEach(() => {
    mockExchange = {
      uuid: v4(),
      name: 'Test Exchange',
      image: 'test-image-url',
      squareImage: 'test-square-image-url',
      description: 'Test description',
      hasLoan: true,
      hasStore: true,
      danger: 10,
      minCoins: 3,
      maxCoins: 5,
    };
    mockCoins = [
      {
        name: 'Coin1',
        iconImage: 'icon1',
        image: 'image1',
        squareImage: 'square1',
        description: 'desc1',
        uuid: v4(),
        color: 'color1',
        minimumPrice: 10,
        maximumPrice: 100,
        cheap: {
          minimumPrice: 5,
          maximumPrice: 50,
        },
        expensive: {
          minimumPrice: 150,
          maximumPrice: 200,
        },
      },
      // ... more coins as needed
    ];
    mockFiatcoin = 1000;
  });

  test('should create an instance of GameExchange', () => {
    const gameExchange = new GameExchange(mockExchange, game.coins, mockFiatcoin);
    expect(gameExchange).toBeInstanceOf(GameExchange);
  });

  test('should ensure CACHE coin in TENT CITY', () => {
    mockExchange.name = 'TENT CITY';
    const gameExchange = new GameExchange(mockExchange, game.coins, mockFiatcoin);
    const cacheCoin = gameExchange.coins.find(coin => coin.name === 'CACHE');
    expect(cacheCoin).toBeDefined();
  });

  test('should calculate coin prices', () => {
    const gameExchange = new GameExchange(mockExchange, game.coins, mockFiatcoin);
    expect(gameExchange.coins.length).toBeGreaterThanOrEqual(mockExchange.minCoins);
    expect(gameExchange.coins.length).toBeLessThanOrEqual(mockExchange.maxCoins);
  });

  test('should calculate danger loss', () => {
    const gameExchange = new GameExchange(mockExchange, game.coins, mockFiatcoin);
    if (gameExchange.hasDanger && mockFiatcoin > 1000) {
      expect(gameExchange.lossFromDanger).toBe(Math.round((mockFiatcoin * .1)));
    } else {
      expect(gameExchange.lossFromDanger).toBe(0);
    }
  });

  // Add more tests as per your requirements
  
});
