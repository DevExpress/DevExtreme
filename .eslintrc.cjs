const rulesDirPlugin = require('eslint-plugin-rulesdir');
const path = require('path');

rulesDirPlugin.RULES_DIR = path.join(__dirname, './eslint-rules');

module.exports = {
    'root': true,
    'env': {
        'node': true,
    },
    'extends': [
        'devextreme/typescript',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'project': ['./tsconfig.eslint.json', './packages/**/tsconfig.package.json'],
        'sourceType': 'module',
    },
    'plugins': [
        'import',
        '@typescript-eslint',
        'unicorn',
        'rulesdir',
    ],
    'rules': {
        'rulesdir/no-mixed-import': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'import/exports-last': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'unicorn/filename-case': [
            'error',
            {
                'case': 'kebabCase',
            },
        ],
        '@typescript-eslint/ban-ts-comment': ['error', {
            'ts-ignore': false,
        }],
        '@typescript-eslint/indent': ['error'],
        '@typescript-eslint/semi': ['error'],
        'import/extensions': ['error', 'ignorePackages', {
            'js': 'never',
            'ts': 'never',
            'tsx': 'never',
        }],
        'import/prefer-default-export': 'off',
        'import/no-default-export': ['error'],
        'import/order': ['error', {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }],
        'no-restricted-syntax': ['error', 'WithStatement'],
        'linebreak-style': ['error', 'unix'],
        'comma-dangle': ['error', 'only-multiline'],
        'no-param-reassign': ['error', {
            'props': false,
        }],
        'no-dupe-class-members': 'off',
        'no-await-in-loop': 'off',
        'arrow-parens': 'off',
        'no-continue': 'off',
        'indent': 'off',
        'semi': 'off',
    },
    'overrides': [
        {
            'files': ['{packages,playgrounds}/*/test/**/*.ts'],
            'env': {
                'jest': true,
            },
        },
        {
            'files': ['*.ts', '*.tsx', '*.js', '*.jsx'],
            'rules': {},
        },
    ],
    'settings': {
        'import/resolver': {
            'typescript': {},
        },
    },
};
