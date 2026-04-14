/**
 * Note Taker backend entry point.
 */

const cors = require("cors");
const express = require("express");
const notesRouter = require("./routes/notes");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(notesRouter);

if (require.main === module) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Note Taker API listening on port ${port}`);
  });
}

module.exports = { app };
