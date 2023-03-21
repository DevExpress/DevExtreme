import { ClientFunction } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import PivotGrid from '../../../model/pivotGrid';

fixture`PivotGrid_fieldChooser`
  .page(url(__dirname, '../../container.html'));

test('Should call \'onExporting\' when export button clicked', async (t) => {
  const pivotGrid = new PivotGrid('#container');
  const exportBtn = pivotGrid.getExportButton();

  await t.click(exportBtn);
  // eslint-disable-next-line no-underscore-dangle
  const exportCalled = await ClientFunction(() => (window as any).__exportCalled as boolean)();

  await t.expect(exportCalled).ok();
}).before(async () => createWidget('dxPivotGrid', {
  dataSource: {
    fields: [{
      caption: 'data A',
      dataField: 'data_A',
    }],
    store: [],
  },
  export: {
    enabled: true,
  },
  onExporting() {
    // eslint-disable-next-line no-underscore-dangle
    (window as any).__exportCalled = true;
  },
  // eslint-disable-next-line no-underscore-dangle
})).after(async () => ClientFunction(() => { (window as any).__exportCalled = undefined; })());
