module.exports = {
    'env': {
        'browser': true,
        'node': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        'accessor-pairs': ['error'],
        'block-spacing': ['error'],
        'camelcase': ['error'],
        'dot-notation': ['error'],
        'eqeqeq': ['error'],
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'no-magic-numbers': ['error', { 'ignore': [-1, 0, 1] }],
        'no-multi-spaces': ['error'],
        'no-unused-vars': ['off'],
        'no-tabs': ['error'],
        'object-curly-spacing': ['error', 'always'],
        'prefer-arrow-callback': ['error'],
        'prefer-const': ['error'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'template-curly-spacing': ['error', 'never'],
        "yoda": ['error']
    }
};