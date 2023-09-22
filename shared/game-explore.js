const _ = require('lodash');
const OpenAI = require('../shared/openai');

const Item = require('../models').Item;
const { v4: uuidv4 } = require('uuid');

class GameExplore {
  static async explore(game) {
    const exchangeName = _.get(game, 'exchange.name');

    // TODO: Do the exploration action:
    game.exchange.explored = true;
    
    const outcome = GameExplore.getWeightedRandomOutcome();
    game.exchange.found = {
      fiatcoin: null,
      items: null,
      danger: null,
      lossFromDanger: null
    }
    
    if (outcome === 'NEUTRAL') {
      game.exchange.found.description = game.exchange.found.story = 'Nothing of interest was found here.';
      game.inventory.log.push(`Day ${game.day}: Explored ${exchangeName} - nothing of interest found.`);
      game.exchange.found.type = 'NEUTRAL';
    } else if (outcome === 'GOOD') {
      game.exchange.found.type = 'GOOD';
      game = await GameExplore.generateGoodOutcome(game);
    } else if (outcome === 'BAD') {
      game.exchange.found.type = 'BAD';
      game = await GameExplore.generateBadOutcome(game);
    }

    return game;
  }

  static getWeightedRandomOutcome() {
    const outcomes = ["GOOD", "BAD", "NEUTRAL", "NEUTRAL"];
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    return outcomes[randomIndex];
  }

  static getRandomGoodOutcome() {
    const outcomes = ["FIATCOIN", "ITEM", "ITEM"];
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    return outcomes[randomIndex];
  }

  static async generateGoodOutcome(game) {
    const outcome = GameExplore.getRandomGoodOutcome();
    const exchangeName = _.get(game, 'exchange.name');

    if (outcome === 'ITEM') {
      const item = await GameExplore.getRandomItem();
      item.uuid = uuidv4();

      // TODO: Add item to user's items:
      game.exchange.found.items = item;
      game.inventory.items.push(item);
      
      // Create one paragraph story about finding an item via OpenAI:
      game.exchange.found.description = `You found a ${item.name} at ${exchangeName}!`;
      game.exchange.found.story = await OpenAI.createExploreStory(`${game.exchange.found.description} ${item.description}`);
      
      game.inventory.log.push(`Day ${game.day}: Explored ${exchangeName} - found a ${item.name}!`);
    }

    if (outcome === 'FIATCOIN') {
      const fiatcoin = GameExplore.generateSkewedFiatcoinNumber();
      game.exchange.found.fiatcoin = fiatcoin;
      game.inventory.fiatcoin += fiatcoin;
      
      // Create one paragraph story about finding a key via OpenAI:
      game.exchange.found.description = `You found a key to a FIATCOIN wallet in ${exchangeName}! $${fiatcoin} has been added!`;
      game.exchange.found.story = await OpenAI.createExploreStory(game.exchange.found.description);
      
      game.inventory.log.push(`Day ${game.day}: Explored ${exchangeName} - found a key to a FIATCOIN wallet! $${fiatcoin} added!`);
    }

    return game;
  }

  static async getRandomItem() {
    const outcomes = [1,2,4,6,7,8];
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    const id = outcomes[randomIndex];
    return await Item.findOne({ raw: true, where: { id: id } });
  }

  static async generateBadOutcome(game) {
    const exchangeName = _.get(game, 'exchange.name');


    if (game.hasBurner) {
      // Create one paragraph story:
      game.exchange.found.description = `You were attacked at ${exchangeName}! But your gun protected you!`;
      game.exchange.found.story = await OpenAI.createExploreStory(game.exchange.found.description);
      
      game.inventory.log.push(`Day ${game.day}: Explored ${exchangeName} - and was attacked! But gun (BURNER) protected you!`);
      return game;
    }

    // Take 30% of fiatcoin:
    const loss = Math.round(game.inventory.fiatcoin * 0.30);
    game.inventory.fiatcoin -= loss;

    if (loss === 0) {

      // Create one paragraph story:
      game.exchange.found.description = `You were attacked at ${exchangeName}! You had no fiatcoin, so nothing was taken!`;
      game.exchange.found.story = await OpenAI.createExploreStory(game.exchange.found.description);
      
      game.inventory.log.push(`Day ${game.day}: Explored ${exchangeName} - and was attacked! But no fiatcoin, so nothing was taken.`);
    } else {
      // Create one paragraph story:
      game.exchange.found.description = `You were attacked at ${exchangeName}! $${loss} was taken!`;
      game.exchange.found.story = await OpenAI.createExploreStory(game.exchange.found.description);
      
      game.inventory.log.push(`Day ${game.day}: Explored ${exchangeName} - and was attacked! $${loss} taken!`);
    }

    return game;
  }

  static generateSkewedFiatcoinNumber() {
    const maxNumber = 250000;
    
    // Generate a random number between 0 and 1, then square it to skew the distribution
    const skewedRandom = Math.pow(Math.random(), 2);
    
    // Scale the skewed random number to the desired range
    const result = Math.ceil(skewedRandom * maxNumber);
    
    return result;
}
}



module.exports = GameExplore