'use strict';

const common = {
    plugins: [
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        ['babel-plugin-inferno', { 'imports': true }],
        'transform-object-assign',
        ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    ],
    ignore: ['**/*.json', '**/sinon.js'],
};

module.exports = {
    cjs: Object.assign({}, common, {
        presets: ['@babel/preset-env'],
        plugins: common.plugins.concat([
            ['add-module-exports', { addDefaultProperty: true }],
            ['@babel/plugin-transform-modules-commonjs', { strict: true }],
            ['@babel/plugin-transform-classes', { loose: true }]
        ])
    }),

    esm: Object.assign({}, common, {
        // eslint-disable-next-line spellcheck/spell-checker
        presets: [['@babel/preset-env', { modules: false, targets: { esmodules: true } }]],
        plugins: common.plugins.concat(
            [['@babel/plugin-transform-runtime', {
                useESModules: true,
                version: '7.5.0' // https://github.com/babel/babel/issues/10261#issuecomment-514687857
            }]]
        )
    })
};
