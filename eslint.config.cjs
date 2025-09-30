// Flat ESLint configuration for domain boundary enforcement.
// Requires ESLint >= 9.
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const domainBoundariesRule = require('./eslint-rules/domain-boundaries');

module.exports = [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.config.js', '*.config.cjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'domain-boundaries': { rules: { enforce: domainBoundariesRule } },
    },
    rules: {
      'domain-boundaries/enforce': 'error',
      // Some sensible TS lint defaults (optional add more later)
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
