module.exports = {
  verbose: true,
  testRegex: '__tests__/.*\\.spec\\.js$',
  coverageReporters: ['text', 'text-summary', 'html'],
  collectCoverageFrom: ['src/**/*.js', '!src/type-defs/**/*.js', '!src/server.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10,
    },
  },
  transform: {
    '^.+\\.js$': 'esm',
  },
};
