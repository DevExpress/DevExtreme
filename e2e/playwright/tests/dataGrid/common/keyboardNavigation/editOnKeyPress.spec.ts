import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { makeRowsViewTemplatesAsync } from '../../helpers/asyncTemplates';

test.describe('Keyboard Navigation - editOnKeyPress', () => {
  ['input', 'div'].forEach((name) => {
    test(`should render edit cell template without errors, template: ${name}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (templateName) => {
        const templates = {
          input: () => $('<input>'),
          div: () => $('<div>').text('Hi, I\'m the template!'),
        };

        return {
          dataSource: [
            {
              data_A: 'data_A',
              data_B: 'data_B',
            },
          ],
          columns: [
            {
              dataField: 'data_A',
              editCellTemplate: templates[templateName],
            },
            'data_B',
          ],
          keyboardNavigation: {
            enabled: true,
            editOnKeyPress: true,
            enterKeyDirection: 'column',
          },
          editing: {
            mode: 'cell',
            allowUpdating: true,
            allowAdding: true,
            startEditAction: 'dblClick',
          },
          templatesRenderAsynchronously: true,
        };
      }, DEFAULT_SELECTOR, { arg: name });
      await makeRowsViewTemplatesAsync(page, DEFAULT_SELECTOR);

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const dataCell = dataGrid.getDataCell(0, 0);

      await dataCell.element.click();
      await page.keyboard.press('f');

      await testScreenshot(page, `edit-cell-keypress-with-custom-cell-template_template-${name}.png`, { element: dataGrid.element });
    });
  });

  test('Focused cell should not flick (T1206435)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      const data = [
        { value: 'data' },
        { value: 'data' },
      ];

      return {
        dataSource: new (window as any).DevExpress.data.CustomStore({
          load() {
            return Promise.resolve(data);
          },
          update() {
            return new Promise<void>((res) => {
              // The save answers late, like a server: the focus moves while it is pending.
              // eslint-disable-next-line no-restricted-syntax
              setTimeout(() => {
                res();
              }, 100);
            });
          },
        }),
        keyboardNavigation: {
          enabled: true,
          editOnKeyPress: true,
          enterKeyAction: 'moveFocus',
          enterKeyDirection: 'column',
        },
        editing: {
          mode: 'cell',
          allowUpdating: true,
          allowAdding: true,
          startEditAction: 'dblClick',
          refreshMode: 'reshape',
        },
        repaintChangesOnly: true,
      };
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstCell = dataGrid.getDataCell(0, 0).element;
    const secondCell = dataGrid.getDataCell(1, 0).element;

    await secondCell.evaluate((element) => {
      (window as any).counter = 0;
      element.addEventListener('focusin', () => {
        (window as any).counter += 1;
      });
    });

    await firstCell.click();

    await page.keyboard.press('M');
    await page.keyboard.press('Enter');

    await expect(secondCell).toBeFocused();
    // A flicker is a second focus when the grid renders the saved data: count after that.
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const focusEventCount = await page.evaluate(() => (window as any).counter);
    expect(focusEventCount).toBe(1);
  });
});
