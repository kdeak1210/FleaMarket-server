import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

const port = 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
