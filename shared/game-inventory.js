class GameInventory {
  constructor(handle) {
    this.debt = 5500;
    this.fiatcoin = 0;
    this.coinsCapacity = 100;
    this.itemsCapacity = 3;
    this.log = [];
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
        amount: 50,
        uuid: 'c50e6f9c-d8ad-4b81-93ac-db65b162a7f3'
      }
    ];
    this.items = [];
  }

}

module.exports = GameInventory;