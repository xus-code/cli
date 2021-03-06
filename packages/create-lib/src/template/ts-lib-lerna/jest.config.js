const path = require('path')

module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  collectCoverageFrom: ['<rootDir>/packages/**/src/**/**.ts'],
  coverageDirectory: path.resolve(__dirname, 'coverage'),
  coverageReporters: ['html', 'text'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  watchPathIgnorePatterns: ['node_modules'],
  testMatch: ['<rootDir>/packages/**/__test__/**/*spec.[jt]s?(x)']
}
