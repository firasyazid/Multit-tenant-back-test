const express = require('express');
const app = express();
require('dotenv/config');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
 const serverUtils = require('./server');
const subdomainMiddleware = require('./middleware/subdomainMiddleware');

const api = process.env.API_URL;
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
 
// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
  
const restaurantRouter = require('./routes/restaurantRoutes');
// Routers
 app.use(`${api}/restaurants`, restaurantRouter);

  // Database connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Test-restau',
  })
  .then(() => {
    console.log('Database Connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

 const port = process.env.PORT || 3003;
 serverUtils.startServer(app, port);

 module.exports = app;
