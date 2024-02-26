const { startToAdmin, scoreToAdmin } = require('./email-admin'); // Replace with your actual module path
const Email = require('./email');

jest.mock('./email');

describe('Email Notification Tests', () => {
  beforeEach(() => {
    Email.getInput = jest.fn();
    Email.send = jest.fn();
  });

  describe('startToAdmin', () => {
    it('should send a start round email to admin', async () => {
      const handle = 'TraderJoe';
      const mockInput = {
        from: 'hashimoto@machinestates.com',
        to: 'erik@erikaugust.com',
        subject: `${handle} has started a round in the trading game`,
        bodyText: `${handle} has started a round in the TRADING SIMULATION.`
      };

      Email.getInput.mockReturnValue(mockInput);
      Email.send.mockResolvedValue('Email sent');

      const result = await startToAdmin(handle);

      expect(Email.getInput).toHaveBeenCalledWith(mockInput);
      expect(Email.send).toHaveBeenCalledWith(mockInput);
      expect(result).toBe('Email sent');
    });
  });

  describe('scoreToAdmin', () => {
    it('should send a score email to admin', async () => {
      const handle = 'TraderJoe';
      const score = 1000;
      const mockInput = {
        from: 'hashimoto@machinestates.com',
        to: 'erik@erikaugust.com',
        subject: `${handle} has scored $${score} in the trading game`,
        bodyText: `A new score of $${score} has been submitted for ${handle}.`
      };

      Email.getInput.mockReturnValue(mockInput);
      Email.send.mockResolvedValue('Score email sent');

      const result = await scoreToAdmin(handle, score);

      expect(Email.getInput).toHaveBeenCalledWith(mockInput);
      expect(Email.send).toHaveBeenCalledWith(mockInput);
      expect(result).toBe('Score email sent');
    });
  });
});
