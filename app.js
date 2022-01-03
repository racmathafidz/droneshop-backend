const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Transaction = require('./models/Transaction');
const productRoutes = require('./routes/productRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const localAuthRoutes = require('./routes/localAuthRoutes');
const cartRoutes = require('./routes/cartRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const requireAuthToken = require('./middleware/authMiddleware');

// Port
const PORT = process.env.port || 5000;

// Express
const app = express();
app.use(express.json()); // Convert request body to json
app.use(express.urlencoded({ extended: true })); // Convert request body and html post form-data to json

// Cors
app.use(cors({
  origin: process.env.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// User's session management
app.use(session({
  secret: process.env.secretKey, // Cookie secret
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
}));

// Parsing cookie
app.use(cookieParser(process.env.secretKey)); // Cookie secret, have to match with session's secret

// Connecting to database and start listening
mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to Database and Start Listening on Port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello');
});

app.use('/auth/google', googleAuthRoutes);
app.use('/auth/local', localAuthRoutes);
app.use('/product', productRoutes);
app.use('/cart', requireAuthToken, cartRoutes);
app.use('/transaction', requireAuthToken, transactionRoutes);
