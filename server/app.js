require('dotenv').config();
const express = require('express');
const app = express();
require('./db/conn')
const cors = require('cors');
const router = require('./routes/router')
const cookieParser = require("cookie-parser");
const Products = require('./models/productSchema')
const DefaultData = require('./defaultdata.js')

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://app-01.onrender.com', // Replace with your target server URL
      changeOrigin: true,
      credentials: true, // Allow sending of cookies
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
    })
  );
};


const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your client's origin
  credentials: true, // Allow sending of cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
};

app.use(cors(corsOptions));

app.use(cookieParser(""));
app.use(express.json());
app.use(router);


app.listen(8000, () => {
  console.log("server is running...");
});


DefaultData();