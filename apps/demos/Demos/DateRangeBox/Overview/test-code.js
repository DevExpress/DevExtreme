testUtils.importAnd(() => 'devextreme/ui/date_range_box', () => DevExpress.ui.dxDateRangeBox, (dxDateRangeBox) => testUtils
  .postponeUntilFound('.dx-daterangebox', 100, 10000)
  .then(() => testUtils.findElements('.dx-daterangebox').forEach((x) => {
    const instance = dxDateRangeBox.getInstance(x);

    if (instance.option('value')[0] !== null && instance.option('value')[1] !== null) {
      instance.option('value', [new Date('2022/08/25 16:35:10'), new Date('2022/08/26 16:35:10')]);
    }
  }))
  .then(() => testUtils.postpone(2000)));
