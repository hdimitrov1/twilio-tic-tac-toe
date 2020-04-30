# twilio-tic-tac-toe

This is an app that plays tic-tac-toe over text.

To set up you'll need

1. Twilio Credentials
2. A public facing webserver (or use ngrok)

## Set up steps

1. Set up a twilio number's inbound messaging to point to the root of the project with GET requests (ie if your host is test.ngrok.com, set the inbound messaging webhook to be GET http://test.ngrok.com/)
2. Copy the .env.example file into .env and fill in your twilio credentials. Make sure they have access to your phone number the texts will be coming from
3. Run `npm i`
4. Run `node index.js`
5. Text the number from 2 different phone numbers to play.