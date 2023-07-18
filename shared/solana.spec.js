const Solana = require('./solana');

describe('getAddressFromName()', () => {
  test('should retrieve address for a given coin name', async () => {
    const name = 'M-SYNCHRO';
    const address = 'FUWTYRdxhQp5eWFSRJEHRk9Dy95CdCaXuGZ9P1ptGEJQ';

    const result = await Solana.getAddressFromName(name);
    expect(result).toBe(address); 
  });
});

describe('getTokenAmount()', () => {
  test('should retrieve correct amount for 1337', async () => {
    const amount = 1337;
    const result = await Solana.getTokenAmount(amount);

    expect(result).toBe(1337000000);
  });

  test('should retrieve correct amount for 50', async () => {
    const amount = 50;
    const result = await Solana.getTokenAmount(amount);

    expect(result).toBe(50000000);
  });
});