/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { appendElementTo } from '../../../helpers/domUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import DataGrid from '../../../model/dataGrid';
import { testScreenshot } from '../../../helpers/themeUtils';

const scrollWindowTo = async (position: object) => {
  await ClientFunction(
    () => {
      (window as any).scroll(position);
    },
    {
      dependencies: {
        position,
      },
    },
  )();
};

const generateData = (count) => {
  const items: Record<string, unknown>[] = [];

  for (let i = 0; i < count; i += 1) {
    items.push({
      ID: i,
      NAME: 'Name',
      Full_Name: 'Full name',
    });
  }

  return items;
};

fixture`FloatingAction with Grid`
  .page(url(__dirname, '../../container.html'));

[undefined, '#grid'].forEach((positionOf) => {
  safeSizeTest(`FAB with grid, position.of is ${positionOf}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const dataGrid = new DataGrid('#grid');

    await t
      .expect(dataGrid.isReady())
      .ok();

    await ClientFunction(() => {
      (window as any).DevExpress.ui.repaintFloatingActionButton();
    })();

    await testScreenshot(t, takeScreenshot, `FAB with grid, position.of is ${positionOf}, before scrolling.png`);

    await scrollWindowTo({ top: 10000000 });

    await t
      .expect(dataGrid.isReady())
      .ok();

    await testScreenshot(t, takeScreenshot, `FAB with grid, position.of is ${positionOf}, after scrolling.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await ClientFunction(() => {
      $('#container').wrap('<div id=\'wrapperContainer\' style=\'height: 100%; overflow: auto;\'></div>');
    })();

    await t.resizeWindow(1000, 400);

    await appendElementTo('#container', 'div', 'grid');
    await appendElementTo('#container', 'div', 'speed-dial-action');

    await createWidget('dxDataGrid', {
      dataSource: generateData(20),
    }, '#grid');

    await createWidget('dxSpeedDialAction', {
      label: 'Add row',
      icon: 'plus',
      position: {
        of: positionOf,
      },
    }, '#speed-dial-action');
  }).after(async () => {
    await ClientFunction(() => {
      $('#container').unwrap();
    })();
  });
});
