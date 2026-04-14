# Continuous integration — backend tests

The backend test command is `npm test`, which runs Jest with `--coverage`.

## Coverage threshold failure

`jest.config.js` defines a **global** `coverageThreshold` of **80%** for lines, branches, functions, and statements (collected from `src/**/*.js`). If any metric falls below that value, Jest exits with a **non-zero status code**, which causes the CI job to **fail**. This blocks merges when coverage regresses below the required minimum.
