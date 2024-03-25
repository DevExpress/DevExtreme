/* eslint-env node */
/* eslint-disable spellcheck/spell-checker */
module.exports = {
    overrides: [{
        files: ['*.ts'],
        extends: ['devextreme/testcafe'],
        rules: {
            'no-only-tests/no-only-tests': 'error',
        }
    }],
};
