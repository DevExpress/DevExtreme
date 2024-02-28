module.exports = {
  root: true,
  extends: [
    'devextreme/spell-check',
    'devextreme/javascript',
    'devextreme/testcafe',
  ],
  rules: {
    curly: [
      'error',
      'multi-line',
    ],
    indent: [
      'error',
      2,
    ],
  },
};
