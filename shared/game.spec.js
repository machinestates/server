const Game = require('../shared/game');

describe('Game', () => {
  describe('canMint()', () => {  
    test('should return true if all condition are met - fiatcoin, coins, debt', () => {
      const game = { 
        inventory: { fiatcoin: 500000, coins: [ { name: 'CACHE', amount: 50 }], debt: 0 } 
    };
      const result = Game.canMint(game);
      expect(result).toBe(true);
    });
  
    test('should return false if the player does not have the fiatcoin', () => {
      const game = { 
        inventory: { fiatcoin: 50000, coins: [ { name: 'CACHE', amount: 50 }], debt: 0 } 
    };
      const result = Game.canMint(game);
      expect(result).toBe(false);
    });
  
    test('should return false if the player has debt', () => {
      const game = { 
        inventory: { fiatcoin: 550000, coins: [ { name: 'CACHE', amount: 50 }], debt: 1000 } 
    };
      const result = Game.canMint(game);
      expect(result).toBe(false);
    });
  
    test('should return false if the player has no coins', () => {
      const game = { 
        inventory: { fiatcoin: 550000, coins: [], debt: 1000 } 
    };
      const result = Game.canMint(game);
      expect(result).toBe(false);
    });
  });

  describe('completeGame()', () => {
    test('should save a round, coins and user coins', async () => {
      const game = { 
        publicKey: '8meApHo9bFT8xHuadiDbXgWyBgQqR7YS5oYRpLgevqoC',
        uuid: '1234',
        handle: 'ease',
        inventory: {
          fiatcoin: 350000,
          coins: [ { name: 'CACHE', amount: 50, uuid: '1234' }, { name: 'M-SYNCHRO', amount: 50, uuid: '1234' }],
          debt: 0,
          log: []
        },
        lastDay: 15
      }

      const result = await Game.completeGame(game);

      expect(result.completed).toBe(true);
      expect(result.uuid).toBe('1234');
      expect(result.coins.length).toBe(2);
    }, 30000);
  });
});