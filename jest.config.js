module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/**/__tests__/*.test.ts',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  testEnvironment: 'node',
}

