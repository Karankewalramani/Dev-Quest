const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const port = 8000;
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const orderRoute = require('./routes/order.route');
const contactRoute = require('./routes/contact.route');
const myModule = require('./routes/result.route');
const resultRoute = myModule.method;
const loginRoute = require('./routes/login.route');
const signUpRoute = require('./routes/signUp.route');
const logoutRoute = require('./routes/logout.route');
const cartRoute = require('./routes/cart.route');

require('./config/mongodb.config');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// ... (existing routes)

app.get('/reduce-prices', (req, res) => {
  // Perform logic to reduce prices

  // Send email notification
  sendEmailNotification();

  res.send('Prices reduced!');
});

// ... (existing route handlers)

function sendEmailNotification() {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@example.com',
    subject: 'Prices Reduced Notification',
    text: 'The prices have been reduced!',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
