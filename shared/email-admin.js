const Email = require('./email');

async function scoreToAdmin(handle, score) {
  const input = Email.getInput({
    from: 'hashimoto@machinestates.com',
    to: 'erik@erikaugust.com',
    subject: `${handle} has scored $${score} in the trading game`,
    bodyText: `A new score of ${score} has been submitted for ${handle}.`
  });

  return await Email.send(input);
}

module.exports = {
  scoreToAdmin
}