
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Metaplex, keypairIdentity, bundlrStorage } =  require('@metaplex-foundation/js');
const { Connection, clusterApiUrl, Keypair, PublicKey } = require('@solana/web3.js');
const secret = require('../config/solana-secret.json');

void async function() {
  const connection = new Connection(process.env.SOLANA_NODE_URL);
  // Dev: const connection = new Connection(clusterApiUrl('devnet'));

  const wallet = Keypair.fromSecretKey(new Uint8Array(secret));
  console.log(wallet.publicKey.toString());

  console.log('Making connection...');
  /** Dev: const devStorageConfig = {
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
      }**/
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());
  
  console.log('Uploading metadata...');
  const { uri: newUri } = await metaplex
  .nfts()
  .uploadMetadata({
      name: 'Machine States',
      symbol: 'MS',
      image: 'https://machinestates.s3.amazonaws.com/ms-red-2048-1.png'
  });

  console.log('Creating NFT collection...');
  const { nft } = await metaplex
  .nfts()
  .create({
      uri: newUri,
      name: 'Machine States',
      sellerFeeBasisPoints: 500,
      symbol: 'MS',
      isCollection: true
  });

  console.log(
    `Collection Mint: https://solscan.io/token/${nft.address.toString()}`
  )
}();
