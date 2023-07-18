/* eslint-disable spellcheck/spell-checker */
'use strict';

module.exports = {
    env: {
        'node': true
    },
    plugins: [
        'node'
    ],
    extends: [
        'plugin:node/recommended'
    ],
    rules: {
        'no-console': 'off',
        'node/no-unpublished-require': 'off',
        'node/no-unsupported-features/node-builtins': 'off',
        'node/shebang': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'spellcheck/spell-checker': 'off',
    },
    globals: {
        'console': true
    }
};
