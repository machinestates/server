const { mockClient } = require("aws-sdk-client-mock");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const Email = require('./email');

const sesClientMock = mockClient(SESClient);
sesClientMock.on(SendEmailCommand).resolves({
  MessageId: '123'
});

describe('Email', () => {
  describe('send', () => {
    test('should send an email via AWS SES', async () => {
      const input = {
        from: 'hashimoto@machinestates.com',
        to: 'erik@erikaugust.com',
        subject: 'Completed round',
        bodyText: 'This is an example.'
      };
      const response = await Email.send(input);
      expect(response).toEqual({ MessageId: '123' });
    });
  });

  describe('compileTemplate', () => {
    test('should compile template', () => {
      const data = { name: 'Test' };
      const result = Email.compileTemplate('test', data);
      expect(result).toBe('<p>Hello Test!</p>');
    });
  });

  describe('getInput', () => {
    test('should throw an error if "from" is not set', async () => {
      try {
        Email.getInput({});
      } catch (error) {
          expect(error.message).toBe('No From set');
      }
    });
  
    test('should throw an error if "to" is not set', async () => {
      try {
        Email.getInput({
          from: 'hashimoto@machinestates.com'
        });
      } catch (error) {
          expect(error.message).toBe('No To set');
      }
    });
  
    test('should throw an error if "to" is not set', async () => {
      try {
        Email.getInput({
          from: 'hashimoto@machinestates.com'
        });
      } catch (error) {
          expect(error.message).toBe('No To set');
      }
    });
  
    test('should throw an error if "subject" is not set', async () => {
      try {
        Email.getInput({
          from: 'hashimoto@machinestates.com',
          to: 'erik@erikaugust.com'
        });
      } catch (error) {
          expect(error.message).toBe('No Subject set');
      }
    });
  
    test('should throw an error if body text is not set', async () => {
      try {
        Email.getInput({
          from: 'hashimoto@machinestates.com',
          to: 'erik@erikaugust.com',
          subject: 'Machine States'
        });
      } catch (error) {
          expect(error.message).toBe('No body text set');
      }
    });
  });

  
});