module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/database.js',
    '!node_modules/**'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/setup.js'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 55,
      lines: 65,
      statements: 65
    }
  },
  testTimeout: 30000,
  verbose: true
};
