testUtils.importAnd(() => 'devextreme/ui/calendar', () => DevExpress.ui.dxCalendar, (dxCalendar) => testUtils
  .postponeUntilFound('.dx-calendar', 100, 10000)
  .then(() => {
    const instance = dxCalendar.getInstance(document.querySelector('.dx-calendar'));
    instance.option('value', [new Date('2023/08/19'), new Date('2023/08/20')]);
  })
  .then(() => testUtils.postpone(2000)));
