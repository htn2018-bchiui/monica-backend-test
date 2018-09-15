// https://www.twilio.com/blog/2017/10/how-to-receive-and-respond-to-a-text-message-with-node-js-express-and-twilio.html
// https://www.twilio.com/docs/sms/quickstart/node
// https://www.twilio.com/docs/libraries/node/usage-guide

const express = require("express"); 
const app = express();
require('dotenv').config(); // for env variables

const port = process.env.PORT || 3000;

const MessagingResponse = require('twilio').twiml.MessagingResponse;

var accountSid = process.env.ACCOUNTSID;
var authToken = process.env.AUTHTOKEN;
const TWILIONUM = process.env.TWILIONUM;
const PHONENUM = process.env.PHONENUM;

const client = require('twilio')(accountSid, authToken);
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`${process.env.TEST}`); // testing if environment varaibles work
});

// webhook works 
// we send message then twilio replies
// could be used as a confirmation for when we send robot the message
app.post('/sms', (req, res) => {
  // Start our TwiML response.
  const twiml = new MessagingResponse();

  // Add a text message.
  const msg = twiml.message('Check out this sweet owl!');

  // Add a picture message.
  msg.media('https://demo.twilio.com/owl.png');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  console.log(twiml.toString());
  console.log(req.body); // to see the extra details the robot will send to the personal number
  res.end(twiml.toString());
});

// post request from twilio to personal number
app.post("/mms", (req,res) => {
  client.messages
    .create({
      body: 'The lego man',
      from: TWILIONUM,
      mediaUrl: 'https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg',
      to: PHONENUM
    })
    .then(message => {
      console.log(message.sid);
      console.log(message.subresourceUris.media);
    })
    .done();
});

app.listen(port, () => {
  console.log('Example app listening on port 3000!');
});


