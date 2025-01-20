const express = require('express');

const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const path = require('path');

require('colors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;

app.listen(PORT);
