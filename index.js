const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const port = 8000;
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const http = require('http');
const socketIO = require('socket.io');

const orderRoute = require('./routes/order.route');
const contactRoute = require('./routes/contact.route');
const myModule = require('./routes/result.route');
const resultRoute = myModule.method;
const loginRoute = require('./routes/login.route');
const signUpRoute = require('./routes/signUp.route');
const logoutRoute = require('./routes/logout.route');
const cartRoute = require('./routes/cart.route');
const wishlistRoute = require('./routes/wishlist.route');

require('./config/mongodb.config');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const server = http.createServer(app);
const io = socketIO(server);

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit a welcome notification to the connected client
  socket.emit('notification', 'Welcome! You are connected.');

  // Emit a reminder to the connected client
  socket.emit('reminder', 'Do you want us to deliver this medicine to you?');

  // Emit news to the connected client
  socket.emit('news', 'Breaking News: Important information here.');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/reduce-prices', (req, res) => {
  // Perform logic to reduce prices

  // Emit a notification to all connected clients
  io.emit('notification', 'Prices have been reduced!');

  // Send email notification
  sendEmailNotification();

  res.send('Prices reduced!');
});

app.use('/order', orderRoute);
app.use('/contact', contactRoute);
app.use('/results', resultRoute);
app.use('/login', loginRoute);
app.use('/logoutuser', logoutRoute);
app.use('/signup', signUpRoute);
app.use('/cart', cartRoute);
app.use('/wishlist', wishlistRoute)

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

server.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
