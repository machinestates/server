class GameInventory {
  constructor(handle) {
    this.debt = 5500;
    this.fiatcoin = 0;
    this.coinsCapacity = 100;
    this.itemsCapacity = 3;
    this.getInitialInventory(handle);
  }

  /**
   * @function getInitialInventory
   * @returns {void}
   */
  getInitialInventory(handle) {
    this.coins = [
      {
        name: 'CACHE',
        amount: 50
      }
    ];
    this.items = [];
  }

}

module.exports = GameInventory;