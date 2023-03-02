/* eslint-env node */
/* eslint-disable spellcheck/spell-checker */
module.exports = {
    extends: ['devextreme/qunit'],
    overrides: [
        {
            files: ['*.js'],
            rules: {
                'import/no-unresolved': 'off',
                'no-unused-vars': 'warn',
                'i18n/no-russian-character': 'warn',
                // TODO Vinogradov: remove after eslint-config-devextreme rc2 will be released:
                'qunit/no-assert-equal': 'off',
                'qunit/no-assert-equal-boolean': 'off',
                'qunit/no-assert-logical-expression': 'off',
                'qunit/no-compare-relation-boolean': 'off',
                'qunit/no-conditional-assertions': 'off',
                'qunit/no-early-return': 'off',
                'qunit/no-negated-ok': 'off',
                'qunit/no-nested-tests': 'off',
            },
        },
    ],
};
