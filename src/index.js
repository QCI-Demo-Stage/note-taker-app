'use strict';

const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/notes', notesRouter);

const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Note Taker API listening on port ${PORT}`);
  });
}

module.exports = app;
