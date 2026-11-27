import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

const getDetailGridLoadCount = (page: Page): Promise<number> => page.evaluate(
  () => (window as any).detailGridLoadCount as number,
);

test.describe('Master detail.Functional', () => {
  test('Detail grid should not reload data when the collapsed master row reenters the viewport with standard scrolling and virtual row rendering (T1326188)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).detailGridLoadCount = 0;
    });

    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [...new Array(200)].map((_, index) => ({
        id: index,
        text: `item ${index}`,
      })),
      keyExpr: 'id',
      height: 400,
      scrolling: {
        mode: 'standard',
        rowRenderingMode: 'virtual',
        // @ts-expect-error private option
        updateTimeout: 0,
        useNative: false,
      },
      paging: {
        enabled: false,
      },
      columns: ['id', 'text'],
      masterDetail: {
        enabled: true,
        template(container) {
          ($('<div>') as any)
            .dxDataGrid({
              keyExpr: 'id',
              height: 180,
              columns: ['id', 'text'],
              dataSource: {
                load() {
                  ((window as any).detailGridLoadCount as number) += 1;

                  return [
                    { id: 1, text: 'detail 1' },
                    { id: 2, text: 'detail 2' },
                  ];
                },
                key: 'id',
              } as any,
            })
            .appendTo(container);
        },
      },
    }));

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act - expand the master row
    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    let detailGrid = dataGrid.getMasterRow(0).getDataGrid();

    // assert
    await dataGrid.getDataRow(0).expectExpanded();
    await expect(detailGrid.element).toBeAttached();
    await expect.poll(() => getDetailGridLoadCount(page)).toBe(1);

    // act - collapse the master row
    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    // assert
    await dataGrid.getDataRow(0).expectExpanded(false);
    await expect(detailGrid.element).not.toBeVisible();
    await expect.poll(() => getDetailGridLoadCount(page)).toBe(1);

    // act
    await dataGrid.scrollTo({ top: 10000 });

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getDataRow(199).element).toBeAttached();

    // act
    await dataGrid.scrollTo({ top: 0 });

    detailGrid = dataGrid.getMasterRow(0).getDataGrid();

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getDataRow(0).element).toBeAttached();
    await expect(detailGrid.element).not.toBeAttached();
    await expect.poll(() => getDetailGridLoadCount(page), {
      message: 'Detail grid data should not be reloaded after scrolling back to the collapsed master row',
    }).toBe(1);
  });
});
