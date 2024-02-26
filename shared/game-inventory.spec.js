const GameInventory = require('./game-inventory');

describe('GameInventory', () => {
  let gameInventory;
  const handle = 'TestHandle';

  beforeEach(() => {
    gameInventory = new GameInventory(handle);
  });

  describe('constructor', () => {
    it('should initialize properties correctly', () => {
      expect(gameInventory.debt).toBe(5500);
      expect(gameInventory.fiatcoin).toBe(0);
      expect(gameInventory.coinsCapacity).toBe(100);
      expect(gameInventory.itemsCapacity).toBe(3);
      expect(gameInventory.log).toEqual([]);
    });

    it('should call getInitialInventory with provided handle', () => {
      const spy = jest.spyOn(GameInventory.prototype, 'getInitialInventory');
      new GameInventory(handle);
      expect(spy).toHaveBeenCalledWith(handle);
      spy.mockRestore();
    });
  });

  describe('getInitialInventory', () => {
    it('should initialize coins and items correctly', () => {
      gameInventory.getInitialInventory(handle);
      expect(gameInventory.coins).toEqual([
        {
          name: 'CACHE',
          amount: 50,
          uuid: 'c50e6f9c-d8ad-4b81-93ac-db65b162a7f3'
        }
      ]);
      expect(gameInventory.items).toEqual([]);
    });
  });
});
