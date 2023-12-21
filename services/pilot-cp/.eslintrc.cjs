/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');
const tsParser = require('@typescript-eslint/parser');
const espree = require('espree');

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended']
    }
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports'
      }
    ]
  },
  parserOptions: {
    templateTokenizer: {
      pug: 'vue-eslint-parser-template-tokenizer-pug'
    },
    parser: {
      js: espree,
      ts: tsParser,
      '<template>': espree
    },
    sourceType: 'module',
    ecmaVersion: 12
  }
};
