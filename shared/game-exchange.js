const { v4 } = require('uuid');
const _ = require('lodash');

class GameExchange {
  constructor(exchange, coins, fiatcoin, ghosted = false) {
    this.uuid = exchange.uuid || v4();
    this.name = exchange.name;
    this.image = exchange.image;
    this.squareImage = exchange.squareImage;
    this.description = exchange.description;
    this.hasLoan = exchange.hasLoan;
    this.fiatcoin = fiatcoin;
    this.hasStore = exchange.hasStore;
    this.hasDanger = GameExchange.getDanger(exchange.danger, ghosted);
    this.coins = GameExchange.getCoinPrices(exchange, coins);
    this.lossFromDanger = GameExchange.getLossFromDanger(this.hasDanger, fiatcoin);
    this.ensureCacheAtTentCity(coins);
  }


  /**
   * @author Ease <ease@machinestates.com>
   * Ensures that the CACHE coin is always available at TENT CITY
   */
  ensureCacheAtTentCity(coins) {
    if (this.name === 'TENT CITY') {
      const cache = _.find(this.coins, { name: 'CACHE' });
      if (!cache) {
        const coin = _.find(coins, { name: 'CACHE' });
        this.coins.push({
          name: _.get(coin, 'name'),
          iconImage: _.get(coin, 'iconImage'),
          image: _.get(coin, 'image'),
          squareImage: _.get(coin, 'squareImage'),
          description: _.get(coin, 'description'),
          uuid: _.get(coin, 'uuid'),
          buyQuantity: 0,
          sellQuantity: 0,
          price: 100,
          isExpensive: false,
          isCheap: false
        });
      }
    }
  }

  static isCheap(coin, chance = 5) {
    return _.get(coin, 'cheap') && (GameExchange.getRandomInteger(0, 100) < chance);
  }
  
  static isExpensive(coin, chance = 5) {
    return _.get(coin, 'expensive') && (GameExchange.getRandomInteger(0, 100) < chance);
  }

  static getCoinPrice(coin) {
    let isCheap = false;
    let isExpensive = false;
    let minimumPrice = _.get(coin, 'minimumPrice');
    let maximumPrice = _.get(coin, 'maximumPrice');

    if (GameExchange.isCheap(coin)) {
      isCheap = true;
      minimumPrice = _.get(coin, 'cheap.minimumPrice');
      maximumPrice = _.get(coin, 'cheap.maximumPrice');
    } else if (GameExchange.isExpensive(coin)) {
      isExpensive = true;
      minimumPrice = _.get(coin, 'expensive.minimumPrice');
      maximumPrice = _.get(coin, 'expensive.maximumPrice');
    }
    const price = GameExchange.getRandomInteger(minimumPrice, maximumPrice);
    return { price, isCheap, isExpensive };
  }

  static getCoinPrices(exchange, allCoins) {
    const minimumCoins = exchange.minCoins || 3;
    const maximumCoins = exchange.maxCoins ? exchange.maxCoins : allCoins.length;
    const numberOfCoins = GameExchange.getRandomInteger(minimumCoins, maximumCoins);
    const availableCoins = GameExchange.getAvailableCoins(numberOfCoins, allCoins);
    const coins = [];

    _.each(allCoins, (coin, key) => {
      if (availableCoins[key] === true) {
        const price = GameExchange.getCoinPrice(coin);
        coins.push({
          name: _.get(coin, 'name'),
          iconImage: _.get(coin, 'iconImage'),
          image: _.get(coin, 'image'),
          squareImage: _.get(coin, 'squareImage'),
          description: _.get(coin, 'description'),
          uuid: _.get(coin, 'uuid'),
          buyQuantity: 0,
          sellQuantity: 0,
          price: _.get(price, 'price'),
          isExpensive: _.get(price, 'isExpensive'),
          isCheap: _.get(price, 'isCheap')
        });
      }
    });
    return coins;
  }

  static getDanger(danger, ghosted = false) {
    if (ghosted) {
      return false;
    }
    return ((Math.random() * 100) < danger);
  }

  static getRandomInteger(minimum, maximum) {
    return Math.round(minimum + (Math.random() * 10000 % (maximum - minimum)));
  }

  static getAvailableCoins(numberOfCoins, coins) {
    const availableCoins = [];

    for (let i = 0; i < numberOfCoins; i++) {
      availableCoins[i] = true;
    }

    for(let i = numberOfCoins; i < coins.length; i++) {
      availableCoins[i] = false;
    }

    return _.shuffle(availableCoins);
  }

  static getLossFromDanger(hasDanger, fiatcoin) {
    return (hasDanger && fiatcoin > 1000) ? Math.round((fiatcoin * .1)) : 0;
  }
}

module.exports = GameExchange;