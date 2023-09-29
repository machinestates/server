require('dotenv').config();

async function send(input) {
  const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
  const client = new SESClient({
    region: 'us-east-1' ,
    credentials: {
      accessKeyId: process.env.POLLY_ACCESS_KEY,
      secretAccessKey: process.env.POLLY_SECRET_KEY
    }
  });
  const command = new SendEmailCommand(input);
  return await client.send(command);
}

function compileTemplate(name, data) {
  const fs = require('fs');
  const path = __dirname + `/../views/email/${name}.hbs`;

  const source = fs.readFileSync(path).toString('utf8');
  const handlebars = require('handlebars');
  return handlebars.compile(source)(data);
}

function getInput(params) {
  if (!params.from) throw new Error('No From set');
  if (!params.to) throw new Error('No To set');

  if (!params.subject) throw new Error('No Subject set');
  if (!params.bodyText) throw new Error('No body text set');

  const input = {
    "Destination": {
      "ToAddresses": [
        params.to
      ]
    },
    "Message": {
      "Body": {
        "Text": {
          "Charset": "UTF-8",
          "Data": params.bodyText
        }
      },
      "Subject": {
        "Charset": "UTF-8",
        "Data": params.subject
      }
    },
    "Source": params.from,
  };

  if (params.bodyHtml) input.Message.Body.Html = {
    Charset: 'UTF-8',
    Data: params.bodyHtml
  };

  return input;
}


module.exports = {
  send,
  getInput,
  compileTemplate
}