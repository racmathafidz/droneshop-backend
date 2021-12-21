const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Article = require('./models/Product');
const productRoutes = require('./routes/productRoutes');

// Port
const PORT = process.env.port || 5000;

// Express
const app = express();

// Cors
app.use(cors({
  origin: process.env.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

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

app.use('/product', productRoutes);
