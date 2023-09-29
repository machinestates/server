const { mockClient } = require("aws-sdk-client-mock");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const EmailAdmin = require('./email-admin');

const sesClientMock = mockClient(SESClient);
sesClientMock.on(SendEmailCommand).resolves({
  MessageId: '123'
});

describe('EmailAdmin', () => {
  describe('scoreToAdmin', () => {
    test('should send an email', async () => {
      const response = await EmailAdmin.scoreToAdmin('test', 100);
      expect(response).toEqual({ MessageId: '123' });
    });
  });
});