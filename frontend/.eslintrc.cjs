module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended', // Basic ESLint rules
    'plugin:vue/vue3-recommended', // Vue 3 rules
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:prettier/recommended', // Prettier plugin for ESLint
  ],
  parser: 'vue-eslint-parser', // Use Vue parser
  parserOptions: {
    parser: '@typescript-eslint/parser', // Use TypeScript parser
    ecmaVersion: 'latest', // Use modern ECMAScript features
    sourceType: 'module', // Use ES modules
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // Custom rules
    'vue/multi-word-component-names': 'off', // Allow single-word component names
    'vue/attribute-hyphenation': 'off', // Disable enforcing hyphenated attribute names
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always', // Allow self-closing for void elements
          normal: 'always', // Allow self-closing for normal elements
          component: 'always', // Allow self-closing for components
        },
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Handle line endings automatically
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {}, // Resolve TypeScript imports
    },
  },
}