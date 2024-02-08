const spellcheckRule = require('eslint-config-devextreme/spell-check').rules['spellcheck/spell-checker'];

spellcheckRule[1].skipWords.push('axe');

module.exports = {
  extends: [
    'devextreme/spell-check',
    'devextreme/javascript',
    'devextreme/testcafe',
  ],
  // eslint-disable-next-line spellcheck/spell-checker
  globals: {
    testUtils: true,
  },
  rules: {
    curly: [
      'error',
      'multi-line',
    ],
    'spellcheck/spell-checker': spellcheckRule,
  },
};
