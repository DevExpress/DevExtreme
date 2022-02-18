import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createDrawer } from './drawer.helpers';

fixture`Drawer`
  .page(url(__dirname, '../../container.html'))
  .beforeEach(async (t) => {
    await t.resizeWindow(700, 700);
  });

const openedStateModeConfigs = [] as any[];
['overlap', 'shrink', 'push'].forEach((openedStateMode) => {
  openedStateModeConfigs.push({ openedStateMode, shading: true });
});

openedStateModeConfigs.forEach((config) => {
  const getScreenshotName = (testName, selector) => `drawer_${config.openedStateMode}_${config.shading ? 'shading' : 'noShading'}_${testName}_${selector}`;

  test(`Empty, openedStateMode:${config.openedStateMode}, shading:true -> hide()`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createOuterContent = ($container) => {
        ($('<div id="hideDrawerBtn">').appendTo($container) as any).dxButton({
          text: 'Hide Drawer',
          onClick: () => ($(`#${$container.attr('id')} #drawer1`) as any).dxDrawer('instance').hide(),
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t.click(Selector('#container #hideDrawerBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('EmptyDrawerHidden', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));
    await t.click(Selector('#popup1_template #hideDrawerBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('EmptyDrawerHidden', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`ColorBox_inner, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createInnerContent = ($container) => {
        ($('<div>').appendTo($container) as any).dxColorBox({
          value: '#f05b41',
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t
      .expect(await takeScreenshot(`${getScreenshotName('ColorBoxInner', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('ColorBoxInner', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`DataGrid_inner, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createInnerContent = ($container) => {
        ($('<div id="dataGrid">').appendTo($container) as any).dxDataGrid({
          editing: { mode: 'row', allowUpdating: true }, dataSource: [{ date: new Date(2010, 10, 10), str: 'qwe' }],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t
      .expect(await takeScreenshot(`${getScreenshotName('DataGridInner', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('DataGridInner', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`FileManager_inner, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createInnerContent = ($container) => {
        ($('<div id="menu">').appendTo($container) as any).dxFileManager({
          currentPath: 'Documents/Projects',
          fileSystemProvider: [
            {
              name: 'Documents',
              isDirectory: true,
              items: [
                {
                  name: 'Projects',
                  isDirectory: true,
                  items: [{ name: 'About.rtf' }, { name: 'Passwords.rtf' }],
                },
              ],
            },
          ],
          height: 300,
          permissions: {
            create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true,
            download: true,
          },
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t
      .expect(await takeScreenshot(`${getScreenshotName('FileManager', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('FileManager', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`Menu_drawer, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createDrawerContent = ($container) => {
        ($('<div id="menu">').appendTo($container) as any).dxMenu({
          dataSource: [{ text: 'item1 very long text wider than panel', items: [{ text: 'item1/item1 very long text wider than panel' }, { text: 'item1/item2' }] }],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t.click('#container #menu .dx-menu-item:eq(0)');

    await t
      .expect(await takeScreenshot(`${getScreenshotName('MenuDrawer', '#container')}.png`))
      .ok();

    await t.click('#popup1_template #menu .dx-menu-item:eq(0)');
    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('MenuDrawer', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`Menu_inner, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createInnerContent = ($container) => {
        ($('<div id="menu">').appendTo($container) as any).dxMenu({
          dataSource: [{ text: 'item1', items: [{ text: 'item1/item1' }, { text: 'item1/item2' }] }],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t
      .expect(await takeScreenshot(`${getScreenshotName('MenuInner', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('MenuInner', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`Menu_outer, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createOuterContent = ($container) => {
        ($('<div id="menu">').appendTo($container) as any).dxMenu({
          dataSource: [{ text: 'item1', items: [{ text: 'item1/item1 very long text wider than panel' }, { text: 'item1/item2' }] }],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t.click('#container #menu .dx-menu-item:eq(0)');

    await t
      .expect(await takeScreenshot(`${getScreenshotName('MenuOuter', '#container')}.png`))
      .ok();

    await t.click('#popup1_template #menu .dx-menu-item:eq(0)');
    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('MenuOuter', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`SelectBox_drawer, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createDrawerContent = ($container) => {
        ($('<div id="selectBox">').appendTo($container) as any).dxSelectBox({
          dataSource: ['item1 very long text wider than panel', 'item2'],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t.click('#container #selectBox .dx-texteditor-container');

    await t
      .expect(await takeScreenshot(`${getScreenshotName('SelectBoxDrawer', '#container')}.png`))
      .ok();

    await t.click('#popup1_template #selectBox .dx-texteditor-container');
    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('SelectBoxDrawer', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`SelectBox_inner, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createInnerContent = ($container) => {
        ($('<div id="selectBox">').appendTo($container) as any).dxSelectBox({
          dataSource: ['item1', 'item2'],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t
      .expect(await takeScreenshot(`${getScreenshotName('SelectBoxInner', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('SelectBoxInner', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`SelectBox_outer, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createOuterContent = ($container) => {
        ($('<div id="selectBox">').appendTo($container) as any).dxSelectBox({
          dataSource: ['item1 very long text wider than panel', 'item2'],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t.click('#container #selectBox .dx-texteditor-container');

    await t
      .expect(await takeScreenshot(`${getScreenshotName('SelectBoxOuter', '#container')}.png`))
      .ok();

    await t.click('#popup1_template #selectBox .dx-texteditor-container');
    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('SelectBoxOuter', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`TabPanel_inner, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createInnerContent = ($container) => {
        ($('<div id="tabPanel">').appendTo($container) as any).dxTabPanel({
          selectedIndex: 1,
          items: [{ title: 'Tab1', text: 'This is Tab1' }, { title: 'Tab2', text: 'This is Tab2' }, { title: 'Tab3', text: 'This is Tab3' }],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t
      .expect(await takeScreenshot(`${getScreenshotName('TabPanelInner', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('TabPanelInner', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`TextBox_drawer, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createDrawerContent = ($container) => {
        ($('<div id="textBox">').appendTo($container) as any).dxTextBox({
          value: 'value',
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t.click('#container #textBox');

    await t
      .expect(await takeScreenshot(`${getScreenshotName('TextBoxDrawer', '#container')}.png`))
      .ok();

    await t.click('#popup1_template #textBox');
    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('TextBoxDrawer', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`TextBox_inner, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createInnerContent = ($container) => {
        ($('<div id="textBox">').appendTo($container) as any).dxTextBox({
          value: 'value',
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t
      .expect(await takeScreenshot(`${getScreenshotName('TextBoxInner', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('TextBoxInner', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test(`TreeView_inner, openedStateMode:${config.openedStateMode}, shading:true`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    await ClientFunction(({ createDrawer, config }) => {
      config.createInnerContent = ($container) => {
        ($('<div id="treeView">').appendTo($container) as any).dxTreeView({
          showCheckBoxesMode: 'normal',
          items: [{
            id: '1',
            text: 'item1',
            expanded: true,
            items: [{
              id: '11',
              text: 'item1_1',
              expanded: true,
              items: [{
                id: '111', text: 'item1_1_1', expanded: true,
              }],
            }],
          }],
        });
      };
      createDrawer(config);
    })({ createDrawer, config });

    await t
      .expect(await takeScreenshot(`${getScreenshotName('TreeViewInner', '#container')}.png`))
      .ok();

    await t.click(Selector('#showPopupBtn'));

    await t
      .expect(await takeScreenshot(`${getScreenshotName('TreeViewInner', '#popup1')}.png`))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
