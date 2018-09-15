// https://www.twilio.com/blog/2017/10/how-to-receive-and-respond-to-a-text-message-with-node-js-express-and-twilio.html
// https://www.twilio.com/docs/sms/quickstart/node
// https://www.twilio.com/docs/libraries/node/usage-guide

const express = require("express"); 
require('dotenv').config(); // for env variables

const port = process.env.PORT || 3000;

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
var accountSid = process.env.ACCOUNTSID;
var authToken = process.env.AUTHTOKEN;

const client = require('twilio')(accountSid, authToken);

const TWILIONUM = process.env.TWILIONUM;

app.get('/', (req, res) => {
  res.send(`${process.env.TEST}`); // testing if environment varaibles work
});

// webhook works
app.post('/sms', (req, res) => {
  // Start our TwiML response.
  const twiml = new MessagingResponse();

  // Add a text message.
  const msg = twiml.message('Check out this sweet owl!');

  // Add a picture message.
  msg.media('https://demo.twilio.com/owl.png');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  console.log(twiml.toString());
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log('Example app listening on port 3000!');
});


