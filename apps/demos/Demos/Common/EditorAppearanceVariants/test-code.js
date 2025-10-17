testUtils.importAnd(() => 'devextreme/animation/fx', () => DevExpress.fx, (fx) => {
  fx.off = true;

  return testUtils
    .postponeUntilFound('.dx-texteditor-with-label.dx-invalid', 100, 5000);
});
