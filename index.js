import './config';
import express from 'express';
// import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

import account from './routes/account';
import api from './routes/api';
import upload from './routes/upload';

const app = express();

// Connect to MongoDB via Mongoose ODM
mongoose.Promise = bluebird;
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/fleamarket')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Middleware Configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
// app.use(express.static(path.join(__dirname, 'public')));

// Routes / Express Router
app.use('/account', account);
app.use('/api', api);
app.use('/upload', upload);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const port = process.env.PORT || 8080;
app.listen(port, (err) => {
  if (err) {
    console.log(`Couldn't connect to port ${port}`);
    return;
  }
  console.log(`Listening on port ${port}`);
});
