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

// webhook works with ngrok
// we send message then twilio replies
// could be used as a confirmation for when we send robot the message, it confirms that it got it
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

  // robot makes request to a url's specific endpoint with the JSON payload that contains patient name, rgb_picture: bytes, lidar_picture: bytes
  // here we take that info to form a message for the phone
  // then send the message 

  // FOR TESTING
  // use postman to configure request body
  client.messages
    .create({
      body: `Some patient ${req.body.text} is hurt`,
      from: TWILIONUM,
      mediaUrl: `${req.body.picture}`,
      to: PHONENUM
    })
    .then(message => {
      console.log(message.sid);
      console.log(message.subresourceUris.media);
    })
    .catch(err => {
      console.error(err);
    })
    .done();
});

app.listen(port, () => {
  console.log('Example app listening on port 3000!');
});


