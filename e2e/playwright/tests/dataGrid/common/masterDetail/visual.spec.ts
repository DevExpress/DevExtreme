import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

test.describe('Master detail.Visual', () => {
  test('Checkbox align right in masterdetail (T1045321)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{
        ID: 1,
        Prefix: 'Mr.',
      }],
      keyExpr: 'ID',
      showBorders: true,
      selection: {
        mode: 'multiple',
      },
      columns: [
        {
          dataField: 'Prefix',
          caption: 'Title',
          width: 400,
        },
      ],
      masterDetail: {
        autoExpandAll: true,
        enabled: true,
        template(container) {
          ($('<div>') as any)
            .dxTreeList({
              columnAutoWidth: true,
              showBorders: true,
              selection: {
                mode: 'multiple',
              },
              dataSource: [{
                ID: 1,
                Title: 'CEO',
                Hire_Date: '1995-01-15',
              }],
              rootValue: -1,
              keyExpr: 'ID',
              parentIdExpr: 'Head_ID',
              columns: [
                {
                  dataField: 'Title',
                  caption: 'Position',
                  width: 200,
                },
                {
                  dataField: 'Hire_Date',
                  dataType: 'date',
                  width: 200,
                },
              ],
              showRowLines: true,
            })
            .appendTo(container);
        },
      },
    }));

    await testScreenshot(page, 'T1045321.png');
  });

  // T1113525
  test('pageSizeSelector has correct layout inside masterDetail', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ column1: 'first' }],
      columns: ['column1'],
      masterDetail: {
        enabled: true,
        template(container) {
          ($('<div>') as any)
            .dxDataGrid({
              pager: {
                displayMode: 'compact',
                showPageSizeSelector: true,
                visible: true,
              },
              columns: ['detail1'],
              dataSource: [],
            })
            .appendTo(container);
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    const masterRow = dataGrid.getMasterRow(0);
    const masterGrid = masterRow.getDataGrid();

    // assert
    await testScreenshot(page, 'T1113525.page-size-select.png', { element: masterGrid.element });
  });

  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    // T1159578
    test('The master detail row should display correctly when renderAsync, virtual scrolling and column fixing features are enabled', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [...new Array(40)].map((_, index) => ({ id: index, text: `item ${index}` })),
        keyExpr: 'id',
        showBorders: true,
        height: 700,
        renderAsync: true,
        masterDetail: {
          enabled: true,
        },
        scrolling: {
          mode: 'virtual',
        },
      });

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      // assert
      await testScreenshot(page, 'T1159578-master-detail-with-renderAsync-1.png', { element: dataGrid.element });

      await dataGrid.scrollTo({ top: 400 });
      await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);

      await dataGrid.getDataRow(16).getCommandCell(0).element.click();

      // assert
      await testScreenshot(page, 'T1159578-master-detail-with-renderAsync-2.png', { element: dataGrid.element });
    });

    [true, false].forEach((useNative) => {
      // T1167889
      test(`The master detail row should display correctly after scrolling when renderAsync, column fixing are enabled and virtual scrolling with useNative=${useNative}`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', (native): Properties => ({
          dataSource: [...new Array(200)].map((_, index) => ({ id: index, text: `item ${index}` })),
          keyExpr: 'id',
          showBorders: true,
          height: 800,
          renderAsync: true,
          templatesRenderAsynchronously: true,
          columnFixing: {
            enabled: true,
            // @ts-expect-error private option
            legacyMode: true,
          },
          masterDetail: {
            enabled: true,
            template: '#test',
          },
          scrolling: {
            mode: 'virtual',
            showScrollbar: 'never',
            useNative: native,
          },
          onContentReady(e) {
            // @ts-expect-error flag for test
            // eslint-disable-next-line no-underscore-dangle
            if (!e.component.__initExpand) {
              // @ts-expect-error flag for test
              // eslint-disable-next-line no-underscore-dangle
              e.component.__initExpand = true;
              e.component.beginUpdate();
              /* eslint-disable @typescript-eslint/no-floating-promises */
              e.component.expandRow(3);
              e.component.expandRow(5);
              e.component.expandRow(7);
              e.component.expandRow(9);
              e.component.expandRow(11);
              e.component.expandRow(13);
              e.component.expandRow(15);
              /* eslint-enable @typescript-eslint/no-floating-promises */
              e.component.endUpdate();
            }
          },
        }), DEFAULT_SELECTOR, { arg: useNative });

        // arrange
        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        // simulating async rendering in React
        await page.evaluate((gridSelector) => {
          const grid = ($(gridSelector) as any).dxDataGrid('instance');

          // eslint-disable-next-line no-underscore-dangle
          grid.getView('rowsView')._templatesCache = {};

          // eslint-disable-next-line no-underscore-dangle
          grid._getTemplate = () => ({
            render(options) {
              // The template renders after the grid, like an asynchronous template of a framework.
              // eslint-disable-next-line no-restricted-syntax
              setTimeout(() => {
                if ($(options.container).closest(document as any).length) {
                  $(options.container).append($('<div/>').html(`
                    <p>${options.model.data.id}</p>
                    <p>${options.model.data.text}</p>
                `));
                  options.deferred?.resolve();
                }
              }, 30);
            },
          });

          grid.repaint();
        }, DEFAULT_SELECTOR);

        const triggerScrollEvent = (): Promise<void> => dataGrid.element.evaluate((element) => {
          const instance = ($(element) as any).dxDataGrid('instance');

          $(instance.getScrollable().container()).trigger('scroll');
        });
        const scrollUp = async (): Promise<void> => {
          let scrollTop = await dataGrid.getScrollTop();

          while (scrollTop > 0) {
            scrollTop -= 25;

            await dataGrid.scrollTo({ top: scrollTop });
            await triggerScrollEvent();
          }
        };

        // The rows of the fixed and the main table align a moment after the delayed templates
        // render. A verify run waits for that; --update-snapshots can record the misaligned frame.
        // assert
        await testScreenshot(page, `T1167889-master-detail-with-scrolling.useNative=${useNative}-1.png`, { element: dataGrid.element });

        // act
        await dataGrid.scrollTo({ top: 1000 });

        // assert
        await testScreenshot(page, `T1167889-master-detail-with-scrolling.useNative=${useNative}-2.png`, { element: dataGrid.element });

        // act
        await scrollUp();

        // assert
        await testScreenshot(page, `T1167889-master-detail-with-scrolling.useNative=${useNative}-3.png`, { element: dataGrid.element });
      });
    });
  });
});
