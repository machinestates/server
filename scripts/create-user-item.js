const _ = require('lodash');
const Item = require('../models').Item;
const UserItem = require('../models').UserItem;
const User = require('../models').User;

const id = process.argv[2];
if (!id) throw new Error('No Item ID specified.');

const username = process.argv[3].toLowerCase();
if (!username) throw new Error('No username specified.');

void async function() {
  try {
    const item = await Item.findOne({ raw: true, where: { id: id } });
    if (!item) throw new Error('Item with specified ID is not found.');

    const user = await User.findOne({
      raw: true, where: { username }
    });

    const userId = user.id;
    if (!userId) throw new Error('User ID is not found.');

    const userItem = UserItem.generate(item);
    userItem.userId = userId;

    const mintedItem = await UserItem.create(userItem);
    console.log(mintedItem);
  } catch (error) {
    console.log(error);
  }
}();