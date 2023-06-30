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
      // Find valid item:
      const item = await UserItem.findOne({
        order: [
          ['id', 'ASC']
        ],
        where: { uuid, name, used: false }
      });
      if (!item) throw new Error('Valid item not found.');

      // Set state for Bag of Fiat - add $50,000 to FIATCOIN:
      game.inventory.fiatcoin += 50000;
      game.itemsUsed.push('BAG OF FIAT');

      // Set item to used:
      item.used = true;
      await item.save();

      game.inventory.items = await GameItem.getItems(game);

      // Return state:
      return game;
    }

    if (name.toUpperCase() === 'GHOST JACKET') {
      // Find valid item:
      const item = await UserItem.findOne({
        order: [
          ['id', 'ASC']
        ],
        where: { uuid, name, used: false }
      });
      if (!item) throw new Error('Valid item not found.');

      // Set state for Ghost Jacket:
      game.ghosted = true;
      game.itemsUsed.push('GHOST JACKET');

      // Set item to used:
      item.used = true;
      await item.save();

      game.inventory.items = await GameItem.getItems(game);

      // Return state:
      return game;
    }

    if (name.toUpperCase() === 'EXTENDED TRIP') {
      // Find valid item:
      const item = await UserItem.findOne({
        order: [
          ['id', 'ASC']
        ],
        where: { uuid, name, used: false }
      });
      if (!item) throw new Error('Valid item not found.');


      // Set state for Extended Trip:
      game.lastDay++;
      game.itemsUsed.push('EXTENDED TRIP');

      // Set item to used:
      item.used = true;
      await item.save();

      game.inventory.items = await GameItem.getItems(game);

      // Return State:
      return game;
    }

    if (name.toUpperCase() === 'HARDWARE WALLET') {
      // Find valid item:
      const item = await UserItem.findOne({
        order: [
          ['id', 'ASC']
        ],
        where: { uuid, name, used: false }
      });
      if (!item) throw new Error('Valid item not found.');


      // Set state for Hardware Wallet:
      game.inventory.coinsCapacity = 200;
      game.itemsUsed.push('HARDWARE WALLET');

      // Set item to used:
      item.used = true;
      await item.save();

      game.inventory.items = await GameItem.getItems(game);

      // Return State:
      return game;
    }

    throw new Error('Item not usable.');
  }
}

module.exports = GameItem;
