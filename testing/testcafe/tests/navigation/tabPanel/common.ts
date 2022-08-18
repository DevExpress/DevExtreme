import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { Item } from '../../../../../js/ui/tab_panel.d';

fixture`TabPanel_common`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'material.blue.light'].forEach((theme) => {
  test(`TabPanel borders with scrolling,theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`TabPanel_borders_with_scrolling,theme=${theme.replace(/\./g, '-')}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(910, 800);
    await changeTheme(theme);

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
  }).after(async (t) => {
    await restoreBrowserSize(t);
    await changeTheme('generic.light');
  });

  test(`TabPanel borders without scrolling,theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`TabPanel_borders_without_scrolling,theme=${theme.replace(/\./g, '-')}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(910, 800);
    await changeTheme(theme);

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
  }).after(async (t) => {
    await restoreBrowserSize(t);
    await changeTheme('generic.light');
  });
});
