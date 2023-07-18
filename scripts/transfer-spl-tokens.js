
const Solana = require('../shared/solana');

void async function() {
  const transaction = await Solana.transferTokens('Apby5nHhNxzYHvpJFn1VGdQBRwBKHCRjCnCkuGiLTRxB', 'M-SYNCHRO', 100);
  console.log(transaction);
}();