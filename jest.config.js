/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/backend/tests'],
  collectCoverageFrom: ['backend/src/**/*.js'],
};
