testUtils.postponeUntil(() => testUtils.findElements('span').some((x) => (x.innerHTML || '').indexOf('Home Appliances Total') !== -1), 200, 20000).then(() => testUtils
  .postponeUntilFound('.dx-pivotgrid').then(() => testUtils.importAnd(() => 'devextreme/ui/pivot_grid', () => DevExpress.ui.dxPivotGrid, (dxPivotGrid) => {
    testUtils.findElements('.dx-pivotgrid').forEach((x) => {
      testUtils.changeOutsideFramework(dxPivotGrid.getInstance(x), (i) => i.resetOption('height'));
    });
  })));
