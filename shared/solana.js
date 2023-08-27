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
    { name: 'M-SYNCHRO', address: 'FUWTYRdxhQp5eWFSRJEHRk9Dy95CdCaXuGZ9P1ptGEJQ' },
    { name: 'CACHE', address: '5Rtn6LA7EcH1SEzcckHydgWRKZFm4WgK1LjYKMyKdjYy' },
    { name: 'SPECTR', address: 'GitkztYracfAXsH4rrYZcozKbmkxNc9WomVxvH1Gi3vR' },
    { name: 'HASHCOIN', address: '5jPEqxsntEDrtZAVR6z1m9VxHx2TnVgSX6E5oDAHkTJe' },
    { name: 'KAIOTE', address: '7TT8C8Hf4WcuVpjdnuzWsv6AkxVJCkSXWPBhGpAiDtT2' },
    { name: 'QTAP', address: '73R63RntAjDxjm4Z1L1ydzpLXxcscp9jc6Sth8Yq4Dhh' },
    { name: 'YEM', address: 'EqE2J7z9N5diAKaxHJRdcVEpDY2Gssnh5pRUL32GYoSS' },
    { name: 'SYNTHGANIX', address: '7LAoBENvwUE4LoduuV746DeEzJfiWRBvsJwtytNt4wuh' },
    { name: 'HYPRCHAIN', address: 'v32jEEByAB6d7k7hLU2sLXKE1jKgBjJoMPeCway39t4' },
    { name: 'PLATELETS', address: 'DpGH8sqySoFL7uWKrNqrQsHbmK6WRos9FPshzT8BPJW9' },
    { name: 'WOBBIE', address: 'D7nRnjpVQGtELULx2FYvLb3VmDrzFcfL1ufKVZq8RQ8H' },
    { name: 'FEDCRED', address: '2G2vdLZ9ycLT9arhEBkdZ9craKSfNJUWdrQDfpT6ysrT' }
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