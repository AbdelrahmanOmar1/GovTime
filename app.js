const express = require('express');
const app = express();
const morgan  = require('morgan');
const UserRouter = require('./routes/userRouter');
require('dotenv').config();



// midellewares
app.use(express.json());
// app.use(morgan('combined'));
app.use(morgan('dev'));
// routes
app.use('/api/v1/users', UserRouter);



// handel unhandeled routes
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});


module.exports = app;
