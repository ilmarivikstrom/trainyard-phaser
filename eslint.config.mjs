// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // eslint.configs.recommended,
  // tseslint.configs.strict,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.strict,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
        semi: ['error', 'always'],  // Enforce semicolons at the end of statements
        'prefer-const': 'error',
    }
  }
);
