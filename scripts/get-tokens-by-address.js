const { getTokenAccounts, parseTokenAccounts, getMetadata }= require('../shared/solana');
const { Connection, GetProgramAccountsFilter, clusterApiUrl } = require('@solana/web3.js');

void async function() {
  const wallet = '5UztTwQ3iTqqgH2gx3nBviphT1j2W3cuHLQvwwMYJK2y';
  const type = 'nft';

  const connection = new Connection(clusterApiUrl('devnet'));

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

  console.log(JSON.stringify(complete, null, 2));


}();