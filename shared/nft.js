require('dotenv').config();

const { Metaplex, keypairIdentity, bundlrStorage } =  require('@metaplex-foundation/js');
const { Connection, clusterApiUrl, Keypair, PublicKey } = require('@solana/web3.js');

const secret = require('../config/solana-secret.json');

/**
 * Creates a new NFT for a given username
 * @param {string} username // Username
 * @param {string} image // URL of the avatar image
 * @param {string} address // Public key of the user
 */
async function createUserNft(username, image, address) {
  const connection = new Connection(process.env.SOLANA_NODE_URL);
  const wallet = Keypair.fromSecretKey(new Uint8Array(secret));
  
  const metadata = setMetadata(username, image);

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  console.log('Uploading metadata...');
  const { uri: newUri } = await metaplex
  .nfts()
  .uploadMetadata({
      ...metadata
  });

  console.log('Creating NFT...');
  const { nft } = await metaplex
  .nfts()
  .create({
      uri: newUri,
      tokenOwner: new PublicKey(address),
      name: username.toUpperCase(),
      sellerFeeBasisPoints: 500,
      symbol: 'MS',
      isMutable: true,
      maxSupply: 1,
      collection: new PublicKey(process.env.SOLANA_COLLECTION_ADDRESS)
  });
  
  return nft;
}

async function getNftsByOwner(address) {
  const connection = new Connection(process.env.SOLANA_NODE_URL);
  const wallet = Keypair.fromSecretKey(new Uint8Array(secret));

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const nfts = await metaplex
  .nfts()
  .findAllByOwner({
      owner: new PublicKey(address),
  });

  const nftsWithMetadata = [];
  for await (const metadata of nfts) {
    try {
      nftsWithMetadata.push(await metaplex.nfts().load({ metadata }));
    } catch (error) {
      console.log(error);
    }
  }
  return nftsWithMetadata;
}

async function verifyUserNft(address) {
  const connection = new Connection(process.env.SOLANA_NODE_URL);
  const wallet = Keypair.fromSecretKey(new Uint8Array(secret));

  console.log(wallet.publicKey.toString());

  console.log('Making connection...');
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const { nft } = await metaplex
  .nfts()
  .verifyCollection({
      mintAddress: new PublicKey(address),
      collectionMintAddress: new PublicKey(process.env.SOLANA_COLLECTION_ADDRESS) 
  });
  return nft;
}


function setMetadata(username, image) {
  const metadata = require('../data/assets/user_avatar.json');
  metadata.name = username.toUpperCase();
  metadata.image = image;

  return metadata;
}

module.exports = {
  setMetadata,
  createUserNft,
  verifyUserNft,
  getNftsByOwner
}