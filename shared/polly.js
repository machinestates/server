const { PollyClient, StartSpeechSynthesisTaskCommand } = require( '@aws-sdk/client-polly');
const REGION = 'us-east-1';
const polly = new PollyClient({ region: REGION });

/**
 * 
 * @param {string} text 
 * @returns {string} url
 */
async function createSpeechFromText(text) {
  const params = {
    Engine: 'neural',
    OutputFormat: 'mp3',
    OutputS3BucketName: 'machine-states-audio',
    Text: text,
    TextType: 'text',
    VoiceId: 'Joanna',
    SampleRate: '22050'
  };
  const response = await polly.send(new StartSpeechSynthesisTaskCommand(params));

  // Return URL to audio file:
  return response.SynthesisTask.OutputUri;
}

module.exports = {
  createSpeechFromText
}