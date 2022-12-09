import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/tab_panel.d';

fixture.disablePageReloads`TabPanel_common`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

test('TabPanel borders with scrolling', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'TabPanel borders with scrolling.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(910, 800);

  const dataSource = [
    {
      title: 'John Heart',
      text: 'John Heart',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    }, {
      title: 'Robert Reagan',
      text: 'Robert Reagan',
    }, {
      title: 'Greta Sims',
      text: 'Greta Sims',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    },
  ] as Item[];

  const tabPanelOptions = {
    dataSource,
    itemTemplate: (itemData, itemIndex, itemElement) => {
      ($('<div>').css('marginTop', 10) as any)
        .dxTabs({
          items: [
            {
              title: 'John Heart',
              text: 'John Heart',
            }, {
              title: 'Olivia Peyton',
              text: 'Olivia Peyton',
            }, {
              title: 'Robert Reagan',
              text: 'Robert Reagan',
            }, {
              title: 'Greta Sims',
              text: 'Greta Sims',
            }, {
              title: 'Olivia Peyton',
              text: 'Olivia Peyton',
            },
          ],
          width: 300,
          showNavButtons: true,
        })
        .appendTo(itemElement);
    },
    height: 120,
    width: 300,
    showNavButtons: true,
  };

  return createWidget('dxTabPanel', tabPanelOptions);
});

test('TabPanel borders without scrolling', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'TabPanel borders without scrolling.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(910, 800);

  const dataSource = [
    {
      title: 'John Heart',
      text: 'John Heart',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    }, {
      title: 'Robert Reagan',
      text: 'Robert Reagan',
    }, {
      title: 'Greta Sims',
      text: 'Greta Sims',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    },
  ] as Item[];

  const tabPanelOptions = {
    dataSource,
    itemTemplate: (itemData, itemIndex, itemElement) => {
      ($('<div>').css('marginTop', 10) as any)
        .dxTabs({
          items: [
            {
              title: 'John Heart',
              text: 'John Heart',
            }, {
              title: 'Olivia Peyton',
              text: 'Olivia Peyton',
            }, {
              title: 'Robert Reagan',
              text: 'Robert Reagan',
            }, {
              title: 'Greta Sims',
              text: 'Greta Sims',
            }, {
              title: 'Olivia Peyton',
              text: 'Olivia Peyton',
            },
          ],
          width: 300,
          showNavButtons: true,
        })
        .appendTo(itemElement);
    },
    height: 120,
    width: 900,
    showNavButtons: true,
  };

  return createWidget('dxTabPanel', tabPanelOptions);
});
