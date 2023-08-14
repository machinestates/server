const { Keypair, Transaction, Connection, PublicKey, clusterApiUrl,  } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, transfer } = require('@solana/spl-token');
const { Metaplex } = require('@metaplex-foundation/js');
const secret = require('../config/solana-secret.json');

/**
 * Finds the address of a coin by name
 * @param {*} name 
 * @returns 
 */
function getAddressFromName(name) {
  const addresses = [
    { name: 'M-SYNCHRO', address: 'FUWTYRdxhQp5eWFSRJEHRk9Dy95CdCaXuGZ9P1ptGEJQ' }
  ];
  return addresses.find(address => address.name === name).address;
}

/**
 * Returns the amount of tokens in lamports
 * @param {*} amount 
 * @returns 
 */
function getTokenAmount(amount) {
  return amount * 1000000;
}

/**
 * 
 * @param {*} wallet 
 * @param {*} solanaConnection 
 * @returns 
 */
async function getTokenAccounts(wallet, solanaConnection) {
  const filters = [
    {
      dataSize: 165,    //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32,     //location of our query in the account (bytes)
        bytes: wallet,  //our search criteria, a base58 encoded string
      }
    }
  ]

  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,   //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {filters: filters}
  );

  return accounts;
}

/**
 * Parses accounts for token mint address, balance, and amount
 * @param {*} accounts 
 * @returns 
 */
function parseTokenAccounts(accounts) {
  const parsed = [];

  accounts.forEach(account => {
    const parsedAccountInfo = account.account.data;
    const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
    const tokenAccount = account.pubkey.toString();

    parsed.push({
      mintAddress,
      tokenBalance,
      tokenAccount
    });
  });
  return parsed;
}

/**
 * Returns the metadata for a given mint address
 * @param {*} mintAddress 
 * @param {*} solanaConnection 
 * @returns 
 */
async function getMetadata(mintAddress, solanaConnection) {
  const metaplex = Metaplex.make(solanaConnection);
  const metadata = await metaplex
    .nfts()
    .findByMint({ mintAddress: new PublicKey(mintAddress) });

  return metadata;
}

/**
 * Transfer tokens from one wallet to another
 * @param {*} to 
 * @param {*} name 
 * @param {*} amount 
 * @returns 
 */
async function transferTokens(to, name, amount) {
  const mintAddress = getAddressFromName(name.toUpperCase());
  const solanaAmount = getTokenAmount(amount);

  if (!solanaAmount) {
    throw new Error('Invalid amount provided.');
  }

  if (!mintAddress) {
    throw new Error('Invalid coin name provided.');
  }

  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const fromWallet = Keypair.fromSecretKey(new Uint8Array(secret));

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    new PublicKey(mintAddress), // Mint
    fromWallet.publicKey
  );

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    new PublicKey(mintAddress), // Mint
    new PublicKey(to) // Public key of recipient
  );

  let signature = await transfer(
    connection,
    fromWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    solanaAmount
  );

  return signature;
}


module.exports = {
  getAddressFromName,
  getTokenAmount,
  getTokenAccounts,
  transferTokens,
  parseTokenAccounts,
  getMetadata
}