testUtils.importAnd(() => 'devextreme/ui/date_range_box', () => DevExpress.ui.dxDateRangeBox, (dxDateRangeBox) => testUtils
  .postponeUntilFound('.dx-daterangebox', 100, 10000)
  .then(() => testUtils.findElements('.dx-daterangebox').slice(1).forEach((x) => {
    const instance = dxDateRangeBox.getInstance(x);

    instance.option({
      startDate: new Date('2022/08/25 16:35:10'),
      endDate: new Date('2022/08/26 16:35:10'),
    });
  }))
  .then(() => testUtils.postpone(2000)));
