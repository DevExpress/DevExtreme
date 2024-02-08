testUtils.importAnd(() => 'devextreme/ui/date_box', () => DevExpress.ui.dxDateBox, (dxDateBox) => testUtils
  .postponeUntilFound('.dx-datebox', 100, 10000)
  .then(() => {
    dxDateBox
      .getInstance(document.querySelector('.dx-datebox'))
      .option('value', new Date('2019/04/22'));
  })
  .then(() => testUtils.postpone(2000)));
