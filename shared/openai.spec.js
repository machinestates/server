const { createStory, createExploreStory } = require('./openai'); // Replace with your actual module path
const { OpenAIApi } = require('openai');

jest.mock('openai');

describe('Story Creation Tests', () => {
  beforeEach(() => {
    OpenAIApi.createChatCompletion = jest.fn();
  });

  describe('createStory', () => {
    it('should create a story based on handle and log', async () => {
      const handle = 'TraderJoe';
      const log = ['Bought Apple stocks', 'Sold Google stocks'];
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Mocked story content',
              },
            },
          ],
        },
      };

      OpenAIApi.prototype.createChatCompletion.mockResolvedValue(mockResponse);

      const story = await createStory(handle, log);

      expect(story).toBe('Mocked story content');
      expect(OpenAIApi.prototype.createChatCompletion).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `In 150 words or less, based off the trading log below, create a story for the character ${handle.toUpperCase()}: \n${log.join('\n')}`,
          },
        ],
      });
    });
  });

  describe('createExploreStory', () => {
    it('should create a story based on a description', async () => {
      const description = 'The forest was dark and full of mystical creatures.';
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Mocked explore story content',
              },
            },
          ],
        },
      };

      OpenAIApi.prototype.createChatCompletion.mockResolvedValue(mockResponse);

      const story = await createExploreStory(description);

      expect(story).toBe('Mocked explore story content');
      expect(OpenAIApi.prototype.createChatCompletion).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Write a one paragraph story from this sentence, "${description}" Make it in second person.`,
          },
        ],
      });
    });
  });
});
