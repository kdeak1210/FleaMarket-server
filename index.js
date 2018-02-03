import './config';
import express from 'express';
// import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'client-sessions';
import logger from 'morgan';
import mongoose from 'mongoose';

import api from './routes/api';

const app = express();

// Connect to MongoDB via Mongoose ODM
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/fleamarket')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Middleware Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  cookieName: 'session',
  secret: process.env.SESSION_SECRET,
  duration: 24 * 60 * 60 * 1000, // 1 day
  activeDuration: 30 * 60 * 1000,
}));
app.use(logger('dev'));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api', api);

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
