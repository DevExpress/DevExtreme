import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Grid on Drop Down Box`.page(
  url(__dirname, '../../container.html'),
);

// T1245111
test('DataGrid on dropDownBox should appear correctly on window resize', async (t) => {
  const dropDownBox = Selector('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(dropDownBox);
  await t.resizeWindow(800, 800);
  await t
    .expect(await takeScreenshot('T1245111-dropDownBox-resize.png'))
    .ok();
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDropDownBox', {
  dataSource: Array.from({ length: 100 }, (_, index) => ({
    Value: index + 1,
    Text: `item ${index + 1}`,
  })),
  dropDownOptions: {
    width: 'auto',
  },
  contentTemplate: (e) => ($('<div/>') as any).dxDataGrid({
    dataSource: e.component.getDataSource(),
  }),
}));
