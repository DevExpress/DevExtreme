testUtils.importAnd(() => 'devextreme/ui/date_box', () => DevExpress.ui.dxDateBox, (dxDateBox) => {
  const instance = dxDateBox.getInstance(document.querySelector('.dx-datebox'));

  instance.option('value', new Date('2015-10-12T06:04:06'));
});
