const _ = require('lodash');

const UserItem = require('../models').UserItem;
const User = require('../models').User;

/**
 * @class GameItem
 * @author Ease <ease@machinestates.com>
 */
class GameItem {

  static async getItems(game) {
    const user = await User.findOne({
      raw: true, where: { username: game.handle.toLowerCase() }
    });
    const userId = _.get(user, 'id');
    if (!userId) throw new Error('User ID is not found.');

    return await UserItem.findAll({
      attributes: ['id', 'uuid', 'createdAt', 'used', 'equipped', 'name', 'description'],
      order: [
        ['id', 'DESC']
      ],
      raw: true,
      where: { userId, used: false, equipped: true }
    });
  }

  static async useItem(game, name, uuid) {
    if (name.toUpperCase() === 'BAG OF FIAT') {

      // Set state for Bag of Fiat - add $50,000 to FIATCOIN:
      game.inventory.fiatcoin += 50000;
      game.itemsUsed.push('BAG OF FIAT');

      // Remove item:
      _.remove(game.inventory.items, (item) => {
        return item.uuid === uuid;
      });

      game.inventory.log.push(`Day ${game.day}: Used a BAG OF FIAT to add $50,000 to FIATCOIN`);

      // Return state:
      return game;
    }

    if (name.toUpperCase() === 'GHOST JACKET') {

      // Set state for Ghost Jacket:
      game.ghosted = true;
      game.itemsUsed.push('GHOST JACKET');

      // Remove item:
      _.remove(game.inventory.items, (item) => {
        return item.uuid === uuid;
      });

      game.inventory.log.push(`Day ${game.day}: Used GHOST JACKET to become invisible to the hackers`);

      // Return state:
      return game;
    }

    if (name.toUpperCase() === 'EXTENDED TRIP') {
    
      // Set state for Extended Trip:
      game.lastDay++;
      game.itemsUsed.push('EXTENDED TRIP');

      // Remove item:
      _.remove(game.inventory.items, (item) => {
        return item.uuid === uuid;
      });

      game.inventory.log.push(`Day ${game.day}: Used EXTENDED TRIP to extend the game by 1 day`);

      // Return State:
      return game;
    }

    if (name.toUpperCase() === 'HARDWARE WALLET') {
      // Set state for Hardware Wallet:
      game.inventory.coinsCapacity = 200;
      game.itemsUsed.push('HARDWARE WALLET');

      // Remove item:
      _.remove(game.inventory.items, (item) => {
        return item.uuid === uuid;
      });

      game.inventory.log.push(`Day ${game.day}: Used HARDWARE WALLET to double coin capacity`);

      // Return State:
      return game;
    }

    throw new Error('Item not usable.');
  }
}

module.exports = GameItem;
