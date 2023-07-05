const { v4 } = require('uuid');
const _ = require('lodash');

const exchanges = require('../data/game').exchanges;
const coins = require('../data/game').coins;
const GameExchange = require('./game-exchange');
const GameInventory = require('./game-inventory');
const GameItem = require('./game-item');
const Coin = require('./coin');
const User = require('../models').User;
const UserItem = require('../models').UserItem;
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

    // Use Item:
    if (action === 'useItem') {
      const name = _.get(body, 'name');
      const uuid = _.get(body, 'uuid');
      if (!uuid) throw new Error('No UUID provided.');
      return await GameItem.useItem(game, name, uuid);
    }

    // No action found:
    throw new Error('Invalid action provided.');
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
      game.inventory.log.push(`Day ${game.day}: HACKED! Lost $${game.exchange.lossFromDanger}`);
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
        game.inventory.log.push(`Day ${game.day}: Bought ${quantity} ${name} at $${coin.price} for a total of $${coin.price * quantity}`);

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
      game.inventory.log.push(`Day ${game.day}: Sold ${quantity} ${name} at $${price} for a total of $${price * quantity}`);

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
    game.inventory.log.push(`Day ${game.day}: Paid $${amount} towards debt`);

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
    game.inventory.log.push(`Day ${game.day}: Borrowed $${amount}`);

    return game;
  }

  /**
   * 
   * @param {} game 
   * @returns {boolean} Whether or not the player can mint coins. 
   */
  static canMint(game) {
    const score = _.get(game, 'inventory.fiatcoin');
    const coins = _.get(game, 'inventory.coins').length;
    const debt = _.get(game, 'inventory.debt');

    // If score is over $100,000, there is no debt, and the player holds coins:
    return !!(score >= 100000 && debt <= 0 && coins);
  }

  static async completeGame(game) {
    const score = (_.get(game, 'inventory.fiatcoin') - _.get(game, 'inventory.debt'));
    const user = await User.findOne({ username: _.get(game, 'handle') });

    // Add to log:
    game.inventory.log.push(`Round completed: Final score is $${score}`);

    // Log:
    console.log(game.inventory.log.join('\n'));

    // Save to database:
    const handle = _.get(game, 'handle');
    const entry = {
      uuid: _.get(game, 'uuid'),
      handle,
      profileImage: null,
      score,
      lastDay: _.get(game, 'lastDay')
    }
    console.log(entry);
    const round = await TradingGameRound.create(entry);

    // Check mint status:
    if (Game.canMint(game)) {
      const coins = _.get(game, 'inventory.coins');
      const minted = await Coin.mint(round, user, coins);
    }
    
    // Return information:
    return {
      uuid: _.get(game, 'uuid'),
      completed: true,
      score: score,
      coins: _.get(game, 'inventory.coins'),
      lastDay: _.get(game, 'lastDay')
    }
  }

  static async getInitialInventory(userId) {
    if (!userId) throw new Error('User ID is not found.');

    return await UserItem.findAll({
      attributes: ['id', 'uuid', 'itemUuid', 'createdAt', 'used', 'equipped', 'name', 'description'],
      order: [
        ['id', 'DESC']
      ],
      raw: true,
      where: { userId, used: false, equipped: true }
    });
  }


}

module.exports = Game;