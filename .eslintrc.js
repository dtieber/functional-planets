module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'filenames', 'prettier'],
  rules: {
    complexity: ['error', { max: 9 }],
    'filenames/match-regex': ['error', '^([a-z1-9-]+.){1,}([a-z]{2,})$'],
    'prettier/prettier': 'error',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  ignorePatterns: ['*.js'],
}
