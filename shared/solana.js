const { Keypair, Transaction, Connection, PublicKey, clusterApiUrl,  } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, transfer } = require('@solana/spl-token');
const secret = require('../config/solana-secret.json');

function getAddressFromName(name) {
  const addresses = [
    { name: 'M-SYNCHRO', address: 'FUWTYRdxhQp5eWFSRJEHRk9Dy95CdCaXuGZ9P1ptGEJQ' }
  ];
  return addresses.find(address => address.name === name).address;
}

function getTokenAmount(amount) {
  return amount * 1000000;
}

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
  transferTokens
}