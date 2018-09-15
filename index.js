// https://www.twilio.com/blog/2017/10/how-to-receive-and-respond-to-a-text-message-with-node-js-express-and-twilio.html
// https://www.twilio.com/docs/sms/quickstart/node
// https://www.twilio.com/docs/libraries/node/usage-guide

const express = require("express"); 
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config(); // for env variables

const port = process.env.PORT || 3000;

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const TWILIONUM = process.env.TWILIONUM;
const PHONENUM = process.env.PHONENUM;

const client = require('twilio')(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`${process.env.TEST} this home page text should show on screen`); 
});

// webhook works with ngrok
// we send message then twilio replies
// could be used as a confirmation for when we send robot the message, it confirms that it got it
app.post('/sms', (req, res) => {
  // Start our TwiML response.
  const twiml = new MessagingResponse();

  // Add a text message.
  const msg = twiml.message('Message has been received!');

  // Add a picture message.
  msg.media('https://demo.twilio.com/owl.png');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  console.log(twiml.toString());
  console.log(req.body); // to see the extra details the robot will send to the personal number
  res.send()
  res.end(twiml.toString());
});

// send initial alert to responders
app.post("/alert", (req,res) => {
  client.messages
    .create({
      body: `Alerting that patient: ${req.body.patient_name} has fallen down`,
      from: TWILIONUM,
      to: PHONENUM,
    })
    .then(message => {
      console.log(message.sid);
    })
    .catch(err => {
      console.error(err);
    })
    .done();

    console.log(res);
    return res;
});

// post request from twilio to personal number , sends the pictures
app.post("/mms", (req,res) => {

  // robot makes request to a url's specific endpoint with the JSON payload that contains patient name, rgb_picture: bytes, lidar_picture: bytes
  // here we take that info to form a message for the phone
  // then send the message 

  // FOR TESTING
  // use postman to configure request body
  client.messages
    .create({
      body: `Your patient, ${req.body.patient_name} is hurt`,
      from: TWILIONUM,
      mediaUrl: [`${req.body.rgb_picture}`, `${req.body.lidar_picture}`],
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

    console.log(res.CallStatus);
});

// when robot sends the video link
app.post("/video", (req,res) => {
  client.messages
    .create({
      body: `Patient ${req.body.patient_name} video is here: ${req.body.video_link}`,
      from: TWILIONUM,
      to: PHONENUM
    })
    .then(message => {
      console.log(message);
    })
    .catch(err => {
      console.error(err);
    })
    .done();
});

app.listen(port, () => {
  console.log('Example app listening on port 3000!');
});


