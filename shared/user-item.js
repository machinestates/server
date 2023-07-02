const UserItem = require('../models').UserItem;


async function getItems(userId) {
  return await UserItem.findAll({
    where: { userId, used: false }
  });
}

async function getByUuid(uuid, userId) {
  return await UserItem.findOne({
    where: { uuid, userId }
  });
}

module.exports = {
  getItems,
  getByUuid
}