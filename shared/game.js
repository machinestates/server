const { v4 } = require('uuid');

const exchanges = require('../data/game').exchanges;
const coins = require('../data/game').coins;
const GameExchange = require('./game-exchange');

class Game {
  constructor(handle) {
    this.uuid = v4();
    this.handle = handle.toLowerCase();
    this.complete = false;
    this.inProgress = true;
    this.day = 1;
    this.lastDay = 15;
    this.exchanges = exchanges;
    this.exchange = this.getInitialExchange();
    this.inventory = null;
    this.itemsUsed = [];
    this.ghosted = false;
  }

  getInitialExchange() {
    const location = this.exchanges[0];
    return new GameExchange(location, coins, 0);
  }
}

module.exports = Game;