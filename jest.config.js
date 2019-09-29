module.exports = {
  roots: [
    '<rootDir>'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: '(/tests/.*|(\\.|/)(test))\\.ts?$',
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  collectCoverage: true,
  coverageReporters: ['text']
};
