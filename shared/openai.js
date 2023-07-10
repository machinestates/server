require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * 
 * @param {string} handle 
 * @param {string[]} log
 * @returns 
 */
async function createStory(handle, log) {
  const prompt = `In 150 words or less, based off the trading log below, create a story for the character ${handle.toUpperCase()}: \n${log.join('\n')}`;

  const messages = [];
  messages.push({ role: 'user', content: prompt });

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages
  });

  return completion.data.choices[0].message.content;
}

module.exports = {
  createStory
}