const { Metaplex, keypairIdentity, bundlrStorage } =  require('@metaplex-foundation/js');
const { Connection, clusterApiUrl, Keypair, PublicKey } = require('@solana/web3.js');
const secret = require('../config/solana-secret.json');
const hashimoto = require('../data/assets/hashimoto_avatar.json');

void async function() {
  const connection = new Connection(clusterApiUrl('devnet'));
  const wallet = Keypair.fromSecretKey(new Uint8Array(secret));

  console.log(wallet.publicKey.toString());

  console.log('Making connection...');
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
      }));


  console.log('Uploading metadata...');
  const { uri: newUri } = await metaplex
  .nfts()
  .uploadMetadata({
      ...hashimoto
  });

  console.log('Creating NFT...');
  const { nft } = await metaplex
  .nfts()
  .create({
      uri: newUri,
      tokenOwner: new PublicKey('8meApHo9bFT8xHuadiDbXgWyBgQqR7YS5oYRpLgevqoC'),
      name: 'Kikai Hashimoto',
      sellerFeeBasisPoints: 0,
      symbol: 'MS',
      isMutable: true,
      maxSupply: 1
  });

  console.log(nft);
}();
