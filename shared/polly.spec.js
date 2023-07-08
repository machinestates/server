const Polly = require('./polly');
const {mockClient} = require('aws-sdk-client-mock');

const { PollyClient, StartSpeechSynthesisTaskCommand } = require( '@aws-sdk/client-polly');

describe('Polly', () => {

    describe('createSpeechFromText()', () => {

      const pollyMock = mockClient(PollyClient);
      pollyMock.on(StartSpeechSynthesisTaskCommand).resolves({
        SynthesisTask: {
          OutputUri: 'https://machine-states-audio.s3.amazonaws.com/1234.mp3'
        }
      });

        test('should return a url', async () => {
            const text = 'This is a test';
            const result = await Polly.createSpeechFromText(text);
            expect(result).toBe('https://machine-states-audio.s3.amazonaws.com/1234.mp3');
        });
    });
});