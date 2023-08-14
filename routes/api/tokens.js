const express = require('express');
const router = express.Router();

const { Connection, clusterApiUrl } = require('@solana/web3.js');
const { getTokenAccounts, parseTokenAccounts, getMetadata } = require('../../shared/solana');

router.get('/', async (request, response, next) => {
  const wallet = request.query.wallet;
  //const wallet = '5UztTwQ3iTqqgH2gx3nBviphT1j2W3cuHLQvwwMYJK2y';
  const type = request.query.type;

  try {
    const connection = new Connection('https://purple-long-bush.solana-mainnet.discover.quiknode.pro/6c3b92f7c3226c932ba8d0d208a1651caa764af0/');

    const accounts = await getTokenAccounts(wallet, connection);
    const parsed = parseTokenAccounts(accounts);
  
    const complete = [];
    for (const token of parsed) {
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
    }
  
    return response.json({ tokens: complete });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
});

module.exports = router;