const { v4 } = require('uuid');
const _ = require('lodash');

const exchanges = require('../data/game').exchanges;
const coins = require('../data/game').coins;
const GameExchange = require('./game-exchange');
const GameInventory = require('./game-inventory');

class Game {
  constructor(handle) {
    this.uuid = v4();
    this.handle = handle.toLowerCase();
    this.complete = false;
    this.day = 1;
    this.lastDay = 15;
    this.exchanges = exchanges;
    this.exchange = this.getInitialExchange();
    this.inventory = new GameInventory(this.handle);
    this.itemsUsed = [];
    this.ghosted = false;
  }

  getInitialExchange() {
    const location = this.exchanges[0];
    return new GameExchange(location, coins, 0);
  }

  static async doAction(game, body) {
    const action = _.get(body, 'action');
    if (!action) throw new Error('No action provided.');

    if (action === 'sell') {
      const name = _.get(body, 'coin');
      const quantity = _.get(body, 'quantity');
      return Game.sell(game, name, quantity);
    }
  }

  static canSell(game, name, quantity) {
    // Checks exchange for coin:
    const exchangeCoins = _.get(game, 'exchange.coins');
    if (!_.find(exchangeCoins, { name })) return false;

    // Checks inventory for coin:
    const inventoryCoins = _.get(game, 'inventory.coins');
    const coin = _.find(inventoryCoins, { name });
    if (!coin) return false;

    // Checks quantity of coin:
    const amount = _.get(coin, 'amount');
    return amount >= quantity;
  }

  static sell(game, name, quantity) {
    if (Game.canSell(game, name, quantity)) {
      const result = _.findIndex(game.inventory.coins, { name });

      game.inventory.fiatcoin += _.find(game.exchange.coins, { name }).price * quantity;
      game.inventory.coins[result].amount -= quantity;

      if (!game.inventory.coins[result].amount) {
        game.inventory.coins.splice(result, 1);
      }
      return game;
    } else {
      throw new Error('Cannot sell quantity of specified coin.');
    }
  }


}

module.exports = Game;