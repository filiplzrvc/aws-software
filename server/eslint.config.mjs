import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    ignores: [
      'public/**',
      'server/public/**',
      'server/public/browser/**',
      'node_modules/**',
      'dist/**',
    ],
  },
  pluginJs.configs.recommended,
];
