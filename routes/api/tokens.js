const path = require('path');
require('dotenv').config();

const express = require('express');
const router = express.Router();
const passport = require('passport');
const createError = require('http-errors');

const { Connection, clusterApiUrl } = require('@solana/web3.js');
const { getTokenAccounts, parseTokenAccounts, getMetadata } = require('../../shared/solana');

const User = require('../../shared/user');
const Redis = require('../../shared/redis');
const { createUserNft, verifyUserNft, getNftsByOwner } = require ('../../shared/nft');


router.get('/', passport.authenticate('jwt', { session: false }), async (request, response, next) => {
  const wallet = request.query.wallet;
  const type = request.query.type;

  try {

    const cached = await Redis.getAvatars(wallet);
    if (cached) {
      return response.json({ tokens: cached });
    }

    const connection = new Connection(process.env.SOLANA_NODE_URL);

    const accounts = await getTokenAccounts(wallet, connection);
    const parsed = parseTokenAccounts(accounts);
  
    const complete = [];
    for (const token of parsed) {
      try {
        const metadata = await getMetadata(token.mintAddress, connection);
        // If NFT flag set, we check metadata if NFT:
        if (type) {
          if (metadata.model === type) {
            complete.push({
              ...token,
              metadata
            })
          }
        } else {
          complete.push({
            ...token,
            metadata
          })
        }
      } catch (error) {
        console.error(error);
        continue;
      }
    }
  
    await Redis.setAvatars(wallet, JSON.stringify(complete));
    return response.json({ tokens: complete });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
});

router.get('/nfts', passport.authenticate('jwt', { session: false }), async (request, response, next) => {
  const wallet = request.query.wallet;

  try {
    const nfts = await getNftsByOwner(wallet);
    return response.json({ tokens: nfts });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
});

router.get('/nft', passport.authenticate('jwt', { session: false }), async (request, response, next) => {
    // Get username:
    const userId = request.user.id;
    if (!userId) return next(createError(401));

    try {
      const user = await User.getById(userId);
      const username = user.username;

      const MintedNft = require('../../shared/minted-nft');
      const nft = await MintedNft.getByUsername(username);

      return response.json({ nft });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: error.message });
    }
});

router.post('/nft', passport.authenticate('jwt', { session: false }), async (request, response, next) => {
  // Get username:
  const userId = request.user.id;
  if (!userId) return next(createError(401));

  const { image, wallet } = request.body;
  if (!image) return next(createError(400, 'Image is not set'));
  if (!wallet) return next(createError(400, 'Wallet address is not set'));

  try {
    const user = await User.getById(userId);
    const MintedNft = require('../../shared/minted-nft');
    const Image = require('../../shared/image');

    // Does NFT exist for given username?
    const existingNft = await MintedNft.getByUsername(user.username);
    if (existingNft) return next(createError(400, 'Username already exists as NFT'));

    // Upload image to Cloudinary and get back URL:
    const uploadedImage = (await Image.uploadDataUrl(image)).secure_url;

    // Create NFT:
    const nft = await createUserNft(user.username, uploadedImage, wallet);
    const address = nft.address.toString();

    // Verify NFT is in collection:
    await verifyUserNft(address);

    // Add to list of NFTs:
    const minted = await MintedNft.create(user.username, uploadedImage, wallet, address);

    console.log(minted);

    return response.json({ nft: minted });

  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }

});

module.exports = router;