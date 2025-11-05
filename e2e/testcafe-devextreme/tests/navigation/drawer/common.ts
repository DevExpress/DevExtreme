import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { OpenedStateMode } from 'devextreme/ui/drawer';
import { Position } from 'devextreme/common';
import url from '../../../helpers/getPageUrl';
import { createDrawer } from './drawer.helpers';
import { isFluent, testScreenshot } from '../../../helpers/themeUtils';

const testFixture = () => {
  if (!isFluent()) {
    // Theme non-dependent tests
    return fixture.disablePageReloads.skip;
  }
  return fixture.disablePageReloads;
};

testFixture()`Drawer`
  .page(url(__dirname, '../../container.html'));

['overlap', 'shrink', 'push'].forEach((openedStateMode: OpenedStateMode) => {
  const testName = `Drawer, openedStateMode=${openedStateMode}, shading=true`;
  test.meta({ browserSize: [600, 600] })(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${testName}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createDrawer({
      options: { openedStateMode },
    });
  });
});

['top', 'bottom', 'left', 'right'].forEach((position: Position) => {
  const testName = `Drawer, position=${position}, shading=true`;
  test.meta({ browserSize: [600, 600] })(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${testName}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createDrawer({
      options: { position },
    });
  });
});

test.meta({ browserSize: [600, 600] })('Drawer hidden', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(Selector('#container #hideDrawerBtn'));

  await testScreenshot(t, takeScreenshot, 'Drawer hidden.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createDrawer({
    createOuterContent: ($container) => {
      ($('<div id="hideDrawerBtn">').appendTo($container) as any).dxButton({
        text: 'Hide Drawer',
        onClick: () => ($(`#${$container.attr('id')} #drawer`) as any).dxDrawer('instance').hide(),
      });
    },
  });
});

[{
  testCase: 'Menu inside drawer',
  selector: '.dx-menu-item',
  createDrawerContent: ($container: JQuery) => {
    ($('<div id="content">').appendTo($container) as any).dxMenu({
      dataSource: [{ text: 'item1 very long text wider than panel', items: [{ text: 'item1/item1 very long text wider than panel' }, { text: 'item1/item2' }] }],
    });
  },
}, {
  testCase: 'SelectBox inside drawer',
  selector: '.dx-texteditor-container',
  createDrawerContent: ($container: JQuery) => {
    ($('<div id="content">').appendTo($container) as any).dxSelectBox({
      dataSource: ['item1 very long text wider than panel', 'item2'],
    });
  },
}, {
  testCase: 'Menu outside drawer',
  selector: '.dx-menu-item',
  createOuterContent: ($container: JQuery) => {
    ($('<div id="content">').appendTo($container) as any).dxMenu({
      dataSource: [{ text: 'item1 very long text wider than panel', items: [{ text: 'item1/item1 very long text wider than panel' }, { text: 'item1/item2' }] }],
    });
  },
}, {
  testCase: 'SelectBox outside drawer',
  selector: '.dx-texteditor-container',
  createOuterContent: ($container: JQuery) => {
    ($('<div id="content">').appendTo($container) as any).dxSelectBox({
      dataSource: ['item1 very long text wider than panel', 'item2'],
    });
  },
}].forEach(({
  testCase, createDrawerContent, createOuterContent, selector,
}) => {
  const testName = `Drawer z-index, ${testCase}, shading=true`;
  test.meta({ browserSize: [600, 600] })(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click(`#container #content ${selector}`);

    await testScreenshot(t, takeScreenshot, `${testName}_container.png`);

    await t.click(Selector('#showPopupBtn'));
    await t.click(`#popup1_template #content ${selector}`);

    await testScreenshot(t, takeScreenshot, `${testName}_popup.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createDrawer({
      createDrawerContent,
      createOuterContent,
      testInPopup: true,
    });
  });
});
