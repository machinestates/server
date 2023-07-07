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
  const prompt = `Based off the trading log below, create a story for the character ${handle.toUpperCase()}:\n${log.join('\n')}`;

  const messages = [];
  messages.push({ role: 'user', content: prompt });

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages
  });

  const content = completion.data.choices[0].message.content;
  console.log(content);
  return content.replace(/(\r\n|\r|\n)/g, '<br>');
}

module.exports = {
  createStory
}