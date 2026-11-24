testUtils.postponeUntil(() => testUtils.findElements('td, span').some((x) => (x.innerHTML || '').indexOf('London') !== -1 || (x.innerHTML || '').indexOf('Accessories') !== -1), 200, 20000).then(() => testUtils
  .postponeUntilFound('.dx-pivotgrid').then(() => testUtils.importAnd(() => 'devextreme/ui/pivot_grid', () => DevExpress.ui.dxPivotGrid, (dxPivotGrid) => {
    testUtils.findElements('.dx-pivotgrid').forEach((x) => {
      const instance = dxPivotGrid.getInstance(x);
      // devextreme-react rolls back options changed outside the component unless this flag is set.
      instance.skipOptionsRollBack = true;
      instance.resetOption('height');
      instance.skipOptionsRollBack = false;
    });
  })));
