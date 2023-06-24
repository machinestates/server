const { createClient } = require('redis');
const client = createClient();

async function setGameState(uuid, state) {
  await client.connect();
  const game = { game: state };
  await client.hSet(`game-${uuid}`, game);
  await client.disconnect();
}

async function getGameState(uuid) {
  await client.connect();
  const game = await client.hGetAll(`game-${uuid}`);
  await client.disconnect();
  return JSON.parse(game.game);
}

module.exports = {
  setGameState,
  getGameState
}


