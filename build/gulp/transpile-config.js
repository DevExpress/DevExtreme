'use strict';

const common = {
    plugins: [
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        ['transform-react-jsx', { 'pragma': 'Preact.h' }],
        'transform-object-assign',
    ],
    ignore: ['**/*.json', '**/sinon.js'],
};

module.exports = {
    cjs: Object.assign({}, common, {
        presets: ['@babel/preset-env'],
        plugins: common.plugins.concat([
            'add-module-exports',
            ['@babel/plugin-transform-modules-commonjs', { strict: true }]
        ])
    }),

    esm: Object.assign({}, common, {
        presets: [['@babel/preset-env', { modules: false }]],
        plugins: common.plugins.concat(
            [['@babel/plugin-transform-runtime', { useESModules: true }]]
        )
    })
};
