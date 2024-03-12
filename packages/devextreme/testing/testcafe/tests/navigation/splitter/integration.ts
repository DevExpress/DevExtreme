import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { clearTestPage } from '../../../helpers/clearPage';
import { testScreenshot } from '../../../helpers/themeUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Splitter_integration`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

safeSizeTest('The splitter pane should be rendered with the correct ratio inside the tab content of TabPanel if pane.size uses pixels', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Splitter panes inside tabPanel tab content, pane_1.size=`100px`.png', { element: '#container' });

  await t.resizeWindow(600, 400);

  await testScreenshot(t, takeScreenshot, 'Splitter panes inside tabPanel tab content after window resize.png, pane_1.size=`100px`', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [400, 400]).before(async () => createWidget('dxTabPanel', {
  width: '100%',
  height: 300,
  deferRendering: true,
  templatesRenderAsynchronously: true,
  dataSource: [{
    title: 'Tab_1',
    text: 'Tab_1 content',
  }, {
    title: 'Tab_2',
    template: () => ($('<div>') as any).dxSplitter({
      orientation: 'horizontal',
      allowKeyboardNavigation: true,
      dataSource: [{
        size: '100px',
        text: 'Pane_1',
        template: () => $('<div>').text('Pane_1'),
      }, {
        splitter: {
          orientation: 'vertical',
          dataSource: [{
            text: 'Pane_2_1',
            template: () => $('<div>').text('Pane_2_1'),
          }, {
            text: 'Pane_2_2',
            template: () => $('<div>').text('Pane_2_2'),
          }],
        },
      }],
    }),
  }],
}));
