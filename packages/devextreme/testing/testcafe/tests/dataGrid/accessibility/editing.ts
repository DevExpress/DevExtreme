import { a11yCheck } from '../../../helpers/accessibility/utils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';
import { getData } from '../helpers/generateDataSourceData';

fixture`Editing tests with axe`
  .page(url(__dirname, '../../container.html'));

([
  'cell',
  'batch',
  'row',
  'form',
  'popup',
] as const).forEach((mode) => {
  test(`Embedded editors in ${mode} edit mode shoud have aria-label attribute`, async (t) => {
    const dataGrid = new DataGrid('#container');

    await t
      .click(dataGrid.getToolbar().getItem(0));

    await a11yCheck(t);
  }).before(() => createWidget('dxDataGrid', {
    dataSource: getData(3, 2),
    height: 400,
    showBorders: true,
    editing: {
      mode,
      allowUpdating: true,
      allowAdding: true,
    },
    toolbar: {
      items: [
        {
          name: 'addRowButton',
          showText: 'always',
        },
      ],
    },
  }));
});
