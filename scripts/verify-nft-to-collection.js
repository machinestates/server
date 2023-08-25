const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Metaplex, keypairIdentity, bundlrStorage } =  require('@metaplex-foundation/js');
const { Connection, clusterApiUrl, Keypair, PublicKey } = require('@solana/web3.js');
const secret = require('../config/solana-secret.json');

void async function() {
  const connection = new Connection(process.env.SOLANA_NODE_URL);
  const wallet = Keypair.fromSecretKey(new Uint8Array(secret));

  console.log(wallet.publicKey.toString());

  console.log('Making connection...');
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

 await metaplex
  .nfts()
  .verifyCollection({
      mintAddress: new PublicKey('Ay1DrpyR3xdcY68EqjQdWhxW1DZYcPrutk1YL9tNgfnh'),
      collectionMintAddress: new PublicKey('75soiuPuwmTDEnmtSdF2JLnUoyyToDc3pkNhDzkuzesu') 
  });
}();
