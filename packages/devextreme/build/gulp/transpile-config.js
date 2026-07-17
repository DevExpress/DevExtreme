'use strict';

const common = {
    plugins: [
        ['babel-plugin-inferno', { 'imports': true }],
        ['@babel/plugin-transform-object-rest-spread', { loose: true }],
    ],
    ignore: ['**/*.json'],
};

const targets = {
    ios: 15,
    android: 95,
    samsung: 13,
};

module.exports = {
    cjs: Object.assign({}, common, {
        presets: [['@babel/preset-env', { targets }]],
        plugins: common.plugins.concat([
            ['add-module-exports', { addDefaultProperty: true }],
            ['@babel/plugin-transform-modules-commonjs', { strict: true }]
        ])
    }),

    tsCjs: Object.assign({}, common, {
        presets: [['@babel/preset-env', { targets }]],
        plugins: common.plugins.concat([
            ['@babel/plugin-transform-modules-commonjs']
        ])
    }),

    esm: Object.assign({}, common, {
        // eslint-disable-next-line spellcheck/spell-checker
        presets: [['@babel/preset-env', { targets, modules: false }]],
        plugins: common.plugins.concat(
            [['@babel/plugin-transform-runtime', {
                useESModules: true,
                version: '7.5.0' // https://github.com/babel/babel/issues/10261#issuecomment-514687857
            }]]
        )
    })
};
