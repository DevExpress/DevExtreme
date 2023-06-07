// TODO Vinogradov: Move this plugin to this package:
//   https://github.com/DevExpress/eslint-config-devextreme
const { rules } = require('@typescript-eslint/eslint-plugin');

module.exports = {
    rules: {
        'no-restricted-imports': rules['no-restricted-imports'],
    },
};
