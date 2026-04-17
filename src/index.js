const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');
const noteStore = require('./models/noteStore');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(notesRouter);

if (require.main === module) {
  noteStore.ready().then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Note Taker API listening on port ${PORT}`);
    });
  });
}

module.exports = app;
