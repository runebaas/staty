const stylisticRules = {
  'array-bracket-newline': ['error', 'never'],
  'array-bracket-spacing': ['error', 'never'],
  'array-element-newline': ['error', 'consistent'],
  'block-spacing': ['error', 'always'],
  'brace-style': ['error', '1tbs', { allowSingleLine: true }],
  'camelcase': ['error', { 'properties': 'always' }],
  'capitalized-comments': ['error', 'always', { ignoreConsecutiveComments: true }],
  'comma-dangle': ['error', 'only-multiline', { functions: 'never' }],
  'comma-spacing': ['error', { before: false, after: true }],
  'comma-style': ['error', 'last'],
  'computed-property-spacing': ['error', 'never'],
  'eol-last': ['error', 'always'],
  'func-call-spacing': ['error', 'never'],
  'func-names': ['error', 'as-needed'],
  'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
  'function-call-argument-newline': ['error', 'consistent'],
  'function-paren-newline': ['error', 'consistent'],
  'id-length': ['error', { min: 3, properties: 'never' }],
  'implicit-arrow-linebreak': ['error', 'beside'],
  'indent': ['error', 2, {
    ArrayExpression: 1,
    CallExpression: { arguments: 2 },
    FunctionDeclaration: { body: 1, parameters: 2 },
    FunctionExpression: { body: 1, parameters: 2 },
    ignoreComments: true,
    ImportDeclaration: 1,
    MemberExpression: 1,
    ObjectExpression: 1,
    outerIIFEBody: 1,
    SwitchCase: 1,
    VariableDeclarator: 2
  }],
  'jsx-quotes': ['error', 'prefer-single'],
  'key-spacing': ['error', {
    beforeColon: false,
    afterColon: true
  }],
  'keyword-spacing': ['error', {
    before: true,
    after: true
  }],
  'linebreak-style': ['error', 'unix'],
  'lines-between-class-members': ['error', 'always'],
  'max-depth': ['error', { max: 4 }],
  'max-len': ['error', {
    code: 140,
    ignoreTrailingComments: true,
    ignoreUrls: true,
    ignoreStrings: true,
    ignoreTemplateLiterals: true,
    ignoreRegExpLiterals: true
  }],
  'max-params': ['warn', {
    max: 3
  }],
  'max-statements': ['warn', { max: 25 }, { ignoreTopLevelFunctions: true }],
  'max-statements-per-line': ['error', { max: 2 }],
  'multiline-comment-style': ['error', 'separate-lines'],
  'multiline-ternary': ['error', 'always-multiline'],
  'new-cap': ['error', {
    newIsCap: true
  }],
  'new-parens': ['error', 'always'],
  'newline-per-chained-call': ['error', {
    ignoreChainWithDepth: 2
  }],
  'no-bitwise': ['error'],
  'no-continue': ['error'],
  'no-lonely-if': ['error'],
  'no-mixed-spaces-and-tabs': ['error'],
  'no-multi-assign': ['error'],
  'no-multiple-empty-lines': ['error', {
    max: 2
  }],
  'no-negated-condition': ['error'],
  'no-nested-ternary': ['error'],
  'no-new-object': ['error'],
  'no-trailing-spaces': ['error'],
  'no-underscore-dangle': ['error', {
    allowAfterThis: true
  }],
  'no-unneeded-ternary': ['error'],
  'no-whitespace-before-property': ['error'],
  'object-curly-newline': ['error', {
    multiline: true,
    minProperties: 2
  }],
  'object-curly-spacing': ['error', 'never'],
  'one-var': ['error', 'never'],
  'padded-blocks': ['error', 'never'],
  'padding-line-between-statements': ['error', { blankLine: "always", prev: "*", next: "return" }],
  'prefer-object-spread': ['error'],
  'quote-props': ['error', 'consistent-as-needed', { keywords: true }],
  'quotes': ['error', 'single', { avoidEscape: true }],
  'semi': ['error', 'always'],
  'semi-spacing': ['error'],
  'semi-style': ['error', 'last'],

  'space-before-blocks': ['error', 'always'],
  'space-before-function-paren': ['error', {
    anonymous: 'always',
    named: 'never',
    asyncArrow: 'always'
  }],
  'space-in-parens': ['error', 'never'],
  'space-infix-ops': ['error'],
  'spaced-comment': ['error', 'always'],
  'switch-colon-spacing': ['error', { after: false, before: true }],
  'wrap-regex': ['error']
};

const importRules = {
  /*
     * eslint-plugin-import
     * https://github.com/benmosher/eslint-plugin-import
     */
  'import/no-default-export': ['error'],
  'import/first': ['error'],
  'import/no-duplicates': ['error'],
  'import/newline-after-import': ['error'],
  'import/no-self-import': ['error'],
  'import/no-useless-path-segments': ['error'],
};
const unicornRules = {
  /*
   * eslint-plugin-unicorn
   * https://github.com/sindresorhus/eslint-plugin-unicorn
   */
  'unicorn/filename-case': [
    'error',
    {
      case: 'camelCase'
    }
  ],
  'unicorn/no-array-instanceof': ['error'],
  'unicorn/no-for-loop': ['error'],
  'unicorn/no-unsafe-regex': ['error'],
  'unicorn/no-zero-fractions': ['error'],
  'unicorn/prefer-exponentiation-operator': ['error'],
  'unicorn/prefer-includes': ['error'],
  'unicorn/prefer-starts-ends-with': ['error'],
  'unicorn/regex-shorthand': ['warn'],
  'unicorn/throw-new-error': ['error'],
};
const typescriptRules = {
  /*
   * Typescript
   */
  '@typescript-eslint/no-unused-vars': ['error'],
  '@typescript-eslint/type-annotation-spacing': ['error', { 'after': true }],
  '@typescript-eslint/no-var-requires': ['error'],
  '@typescript-eslint/no-parameter-properties': ['error']
};

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  plugins: [
    'import',
    'unicorn',
    '@typescript-eslint/eslint-plugin'
  ],
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/typescript'
  ],
  rules: {
    ...stylisticRules,

    ...importRules,
    ...unicornRules,
    ...typescriptRules
  }
};
