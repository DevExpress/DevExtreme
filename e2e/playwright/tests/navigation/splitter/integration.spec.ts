import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import TabPanel from '../../../models/tabPanel';

test.describe('Splitter_integration', () => {
  test.describe(() => {
    test.use({ browserSize: [400, 400] });

    test('The splitter pane should be rendered with the correct ratio inside the tab content of TabPanel if pane.size uses pixels', async ({ page }) => {
      await createWidget(page, 'dxTabPanel', () => ({
        width: '100%',
        height: 300,
        deferRendering: true,
        templatesRenderAsynchronously: true,
        dataSource: [{
          title: 'Tab_1',
          collapsible: true,
          text: 'Tab_1 content',
        }, {
          title: 'Tab_2',
          collapsible: true,
          template: () => ($('<div>') as any).dxSplitter({
            orientation: 'horizontal',
            allowKeyboardNavigation: true,
            dataSource: [{
              size: '100px',
              text: 'Pane_1',
              collapsible: true,
              template: () => $('<div>').text('Pane_1'),
            }, {
              collapsible: true,
              splitter: {
                orientation: 'vertical',
                dataSource: [{
                  text: 'Pane_2_1',
                  collapsible: true,
                  template: () => $('<div>').text('Pane_2_1'),
                }, {
                  text: 'Pane_2_2',
                  collapsible: true,
                  template: () => $('<div>').text('Pane_2_2'),
                }],
              },
            }],
          }),
        }],
      }));

      const tabPanel = new TabPanel(page, '#container');

      await tabPanel.getTab(1).click();
      await tabPanel.element.click();

      await testScreenshot(page, 'Splitter in tab content, pane_1.size=`100px`.png', { element: '#container' });

      await page.setViewportSize({ width: 600, height: 400 });

      await testScreenshot(page, 'Splitter in tab content after window resize, pane_1.size=`100px`.png', { element: '#container' });
    });
  });
});
