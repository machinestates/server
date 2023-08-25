const MintedNft = require('../models').MintedNft;


async function getByUsername(username) {
  return await MintedNft.findOne({
    where: { username }
  });
}

/**
 * 
 * @param {string} username 
 * @param {string} image 
 * @param {string} wallet 
 * @param {string} address 
 * @returns 
 */
async function create(username, image, wallet, address) {
  return await MintedNft.create({
    username,
    image,
    wallet,
    address
  });
}


module.exports = {
  create,
  getByUsername
}