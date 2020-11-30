module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/kebab": "off",
    "@typescript-eslint/class-name-casing": "off",
    "@typescript-eslint/no-this-alias": "off",
    "prefer-rest-params": "off"
  }
}
