module.exports = {
  verbose: true,
  testRegex: '__tests__/.*\\.spec\\.js$',
  coverageReporters: ['text'],
  collectCoverageFrom: ['src/**/*.js', '!src/type-defs/**/*.js', '!src/server.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10,
    },
  },
};
