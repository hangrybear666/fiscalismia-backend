module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: { browser: true, es6: true, node: true },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: ['jest.config.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly', module: true },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: false },
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json'
      },
      plugins: ['@typescript-eslint'],
      rules: {
        indent: ['error', 2, { SwitchCase: 1 }],
        quotes: ['error', 'single'],
        '@typescript-eslint/no-explicit-any': 0
      }
    }
  ]
};
