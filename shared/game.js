const { v4 } = require('uuid');
const _ = require('lodash');

const exchanges = require('../data/game').exchanges;
const coins = require('../data/game').coins;
const GameExchange = require('./game-exchange');
const GameInventory = require('./game-inventory');

const TradingGameRound = require('../models').TradingGameRound;

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

    if (action === 'buy') {
      const name = _.get(body, 'coin');
      const quantity = _.get(body, 'quantity');
      return Game.buy(game, name, quantity);
    }

    // Travel:
    if (action === 'travel') {
      const name = _.get(body, 'exchange');
      return await Game.travel(game, name);
    }

    // Pay Debt:
    if (action === 'pay') {
      const amount = _.get(body, 'amount');
      return Game.payDebt(game, amount);
    }

    // Borrow
    if (action === 'borrow') {
      const amount = _.get(body, 'amount');
      return Game.borrow(game, amount);
    }

    // Complete Game:
    if (action === 'complete') {
      return Game.completeGame(game);
    }
  }

  static async travel(game, name) {
    const exchange = _.find(exchanges, { name });
    if (!exchange) return new Error('Cannot move to specified exchange.');

    // Generate exchange:
    game.exchange = new GameExchange(exchange, coins, game.inventory.fiatcoin, game.ghosted);

    // Calculate loss from danger:
    game.inventory.fiatcoin -= game.exchange.lossFromDanger;
    if (game.exchange.lossFromDanger > 0) {
      // Adds information about Deck Jack hacker:
      // game.exchange.hacker = await DeckJack.useActive(game);
    }

    // Add day to game:
    game.day++;

    // Add daily interest to debt:
    if (game.inventory.debt) {
      game.inventory.debt *= 1.1; // 10% daily interest
      game.inventory.debt = Math.round(game.inventory.debt);
    }

    // Add to log:
    game.inventory.log.push(`Day ${game.day}: Arrived at ${exchange.name}`);

    // If out of days, complete game:
    if (game.day > game.lastDay) {
      return await Game.completeGame(game);
    } else {
      return game;
    }
  }

  static canBuy(game, name, quantity) {
    // Checks exchange for coin:
    const coin = _.find(_.get(game, 'exchange.coins'), {name});
    if (!coin) return false;

    // Checks inventory fiatcoin:
    const cost = (_.get(coin, 'price') * quantity);
    const fiatcoin = _.get(game, 'inventory.fiatcoin');
    return (fiatcoin >= cost);
  }

  static buy(game, name, quantity) {
    if (Game.canBuy(game, name, quantity)) {
      const coin = _.find(_.get(game, 'exchange.coins'), {name});

      // Subtract fiatcoin:
      game.inventory.fiatcoin -= coin.price * quantity;

      // Add coin:
      const item = _.findIndex(game.inventory.coins, { name });
      if (!game.inventory.coins[item]) {
        game.inventory.coins.push({
          name: _.get(coin, 'name'),
          amount: quantity,
          uuid: _.get(coin, 'uuid'),
          image: _.get(coin, 'image') || '',
          iconImage: _.get(coin, 'iconImage') || '',
          squareImage: _.get(coin, 'squareImage') || '',
          description: _.get(coin, 'description') || ''
        });

        // Log:
        game.inventory.log.push(`Day ${game.day}: Bought ${quantity} ${name} at $${coin.price} for a total of $${coin.price * quantity} FIATCOIN`);

      } else {
        game.inventory.coins[item].amount += quantity;
      }

      return game;
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

      const price = _.find(game.exchange.coins, { name }).price;
      game.inventory.fiatcoin += price * quantity;
      game.inventory.coins[result].amount -= quantity;

      if (!game.inventory.coins[result].amount) {
        game.inventory.coins.splice(result, 1);
      }

      // Add to log:
      game.inventory.log.push(`Day ${game.day}: Sold ${quantity} ${name} at $${price} for a total of $${price * quantity} FIATCOIN`);

      return game;
    } else {
      throw new Error('Cannot sell quantity of specified coin.');
    }
  }

  static payDebt(game, amount) {
    const fiatcoin = _.get(game, 'inventory.fiatcoin');
    if (fiatcoin < amount) throw new Error('Not enough FIATCOIN to pay debt amount.');

    game.inventory.fiatcoin -= amount;
    game.inventory.debt = Math.max((game.inventory.debt - amount), 0);

    // Log
    game.inventory.log.push(`Day ${game.day}: Paid ${amount} FIATCOIN towards debt.`);

    return game;
  }

  static borrow(game, amount) {
    const debt = _.get(game, 'inventory.debt');
    if (debt > 20000) throw new Error('Max debt has been reached.');

    // Add amount to debt:
    game.inventory.debt += amount;

    // Add amount to fiatcoin:
    game.inventory.fiatcoin += amount;

    // Log
    game.inventory.log.push(`Day ${game.day}: Borrowed ${amount} FIATCOIN`);

    return game;
  }

  static async completeGame(game) {
    const score = (_.get(game, 'inventory.fiatcoin') - _.get(game, 'inventory.debt'));

    // Save to database:
    const handle = _.get(game, 'handle');
    const entry = {
      uuid: _.get(game, 'uuid'),
      handle,
      profileImage: null,
      score,
      lastDay: _.get(game, 'lastDay')
    }
    await TradingGameRound.create(entry);
    
    // Return information:
    return {
      uuid: _.get(game, 'uuid'),
      completed: true,
      score: score,
      coins: _.get(game, 'inventory.coins'),
      lastDay: _.get(game, 'lastDay')
    }
  }


}

module.exports = Game;