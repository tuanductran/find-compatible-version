import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  formatters: true,
}, {
  rules: {
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    'ts/no-explicit-any': 'off',
    'ts/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
    }],
    'prefer-const': 'error',
  },
})
