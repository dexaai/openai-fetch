/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@dexaai/eslint-config/node'],
  ignorePatterns: ['openai-types/', 'dist/', 'node_modules/'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-process-env': 'off',
    'no-console': 'off',
    'prefer-const': 'off',
  },
};
