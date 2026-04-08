module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'prettier', // 必须放在最后，会覆盖前面的冲突规则
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // ==================== 可能的错误 ====================
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-var': 'error', // 禁止使用 var

    // ==================== 最佳实践 ====================
    'eqeqeq': ['error', 'always'], // 强制使用 ===
    'no-eval': 'error', // 禁止使用 eval
    'no-implied-eval': 'error',
    'no-with': 'error',
    'no-new-wrappers': 'error',
    'no-throw-literal': 'error',
    'prefer-const': 'error', // 优先使用 const
    'no-return-await': 'error',

    // ==================== 代码风格 ====================
    'semi': ['error', 'never'], // 不使用分号
    'quotes': ['error', 'single', { avoidEscape: true }], // 单引号
    'indent': ['error', 2, { SwitchCase: 1 }], // 2空格缩进
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    'no-trailing-spaces': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'comma-dangle': ['error', 'only-multiline'], // 多行时保留尾随逗号
    'object-curly-spacing': ['error', 'always'], // 对象大括号空格
    'array-bracket-spacing': ['error', 'never'], // 数组方括号无空格

    // ==================== 复杂度 ====================
    'complexity': ['warn', 15], // 圈复杂度
    'max-depth': ['warn', 4], // 嵌套深度
    'max-lines-per-function': ['warn', 100], // 函数最大行数
    'max-params': ['warn', 4], // 参数个数

    // ==================== 安全问题 ====================
    'no-script-url': 'error', // 禁止 javascript:
    'no-alert': 'warn', // 警告使用 alert
  },
}
