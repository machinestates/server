/**
 * Creates a new trading story based off of game log.
 * 
 */

require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const log = `
Day 1: Sold 50 CACHE at $100 for a total of $5000
Day 2: Arrived at PLASMANET
Day 2: Paid $6050 towards debt
Day 3: Arrived at TENT CITY
Day 3: Bought 100 KAIOTE at $340 for a total of $34000
Day 4: Arrived at PLASMANET
Day 5: Arrived at FEDERAL COIN SERVICE
Day 5: HACKED! Lost $1495
Day 6: Arrived at VYPR
Day 7: Arrived at FEDERAL COIN SERVICE
Day 7: HACKED! Lost $1346
Day 8: Arrived at VYPR
Day 8: HACKED! Lost $1211
Day 9: Arrived at PLASMANET
Day 10: Arrived at FEDERAL COIN SERVICE
Day 10: HACKED! Lost $1090
Day 11: Arrived at PLASMANET
Day 12: Arrived at CHARLOTTESWEB
Day 12: HACKED! Lost $981
Day 13: Arrived at PLASMANET
Day 13: Sold 100 KAIOTE at $976 for a total of $97600
Day 14: Arrived at FEDERAL COIN SERVICE
Day 14: Bought 5 1337 at $98 for a total of $490
Day 15: Arrived at TENT CITY
Round completed: Final score is $105937
Minted 5 1337!
`;

const prompt = `Based off the trading log below, create a story for the character Ease: ${log}`;

const messages = [];
messages.push({ role: 'user', content: prompt });

void async function() {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages
  });
  console.log(completion.data.choices[0].message.content);
}();