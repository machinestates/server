const Email = require('../../shared/email');

void async function() {

  console.log('Email admin test email...');

  const input = Email.getInput({
    from: 'hashimoto@machinestates.com',
    to: 'erik@erikaugust.com',
    subject: 'Testing functionality...',
    bodyText: 'This is a test of the email functionality.'
  });

  const response = await Email.send(input);
  console.log(response);

}();