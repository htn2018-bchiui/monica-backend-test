// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console

// TODO CONFIGURE ENV VARIABLES AFTER https://www.npmjs.com/package/dotenv

var twilio = require('twilio');

const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'PATIENT HAS FALLEN DOWN', 
     from: '+15017122661', 
     to: '+15558675310' 
   })
  .then(message => console.log(message.sid))
  .done();
