const { createApp } = require('../../src/app');

const port = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(port, () => {
  console.log(`Note Taker API listening on port ${port}`);
});
