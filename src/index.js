/**
 * Note Taker backend: Express app and HTTP server entry.
 */

const express = require("express");
const cors = require("cors");
const notesRouter = require("./routes/notes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(notesRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal Server Error" });
});

function listen(port = process.env.PORT ?? 3000) {
  return app.listen(port);
}

/* istanbul ignore if: CLI entry — not exercised by unit tests */
if (require.main === module) {
  listen();
}

module.exports = { app, listen };
