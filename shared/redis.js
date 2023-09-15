const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/redis.json')[env];

const { createClient } = require('redis');
const client = createClient(config);

async function setGameState(uuid, state) {
  await client.connect();
  const game = { game: state };
  await client.hSet(`game-${uuid}`, game);
  await client.disconnect();
}

async function setAvatars(wallet, avatars) {
  await client.connect();
  avatars = { avatars: avatars };
  await client.hSet(`avatars-${wallet}`, avatars);
  await client.expire(`avatars-${wallet}`, 60 * 5);
  await client.disconnect();
}

async function getAvatars(wallet) {
  await client.connect();
  const avatars = await client.hGetAll(`avatars-${wallet}`);
  await client.disconnect();
  if (Object.hasOwnProperty.bind(avatars)('avatars')) {
    return JSON.parse(avatars.avatars);
  } else {
    return null;
  }
}

async function getGameState(uuid) {
  await client.connect();
  const game = await client.hGetAll(`game-${uuid}`);
  await client.disconnect();
  return JSON.parse(game.game);
}

module.exports = {
  setGameState,
  getGameState,
  setAvatars,
  getAvatars
}


