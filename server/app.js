require('dotenv').config();
const express = require('express');
const app = express();
require('./db/conn')
const cors = require('cors');
const router = require('./routes/router')
const cookieParser = require("cookie-parser");
const Products = require('./models/productSchema')
const DefaultData = require('./defaultdata.js')
const PORT = process.env.PORT || 8000

const corsOptions = {
  origin: process.env.Client || 'https://amazon-clone-frontend-iq23.onrender.com', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
};
 
app.use(cors(corsOptions));

app.use(cookieParser(""));
app.use(express.json());
app.use(router);


app.listen(PORT, () => {
  console.log("server is running...");
});


DefaultData();