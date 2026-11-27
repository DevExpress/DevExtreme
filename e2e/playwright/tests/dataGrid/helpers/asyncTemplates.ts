import type { Page } from '@playwright/test';

export const makeRowsViewTemplatesAsync = async (page: Page, selector: string): Promise<void> => {
  await page.evaluate((gridSelector) => {
    const dataGrid = ($(gridSelector) as any).dxDataGrid('instance');

    const rowsView = dataGrid.getView('rowsView');
    const originRender = rowsView.renderDelayedTemplates.bind(rowsView);

    // eslint-disable-next-line no-underscore-dangle
    rowsView._templatesCache = {};
    rowsView.renderDelayedTemplates = (changes) => {
      // The templates render after the grid, like asynchronous templates of a framework.
      // eslint-disable-next-line no-restricted-syntax
      setTimeout(() => { originRender(changes); });
    };
  }, selector);
};

export const makeColumnHeadersViewTemplatesAsync = async (
  page: Page,
  selector: string,
): Promise<void> => {
  await page.evaluate((gridSelector) => {
    const dataGrid = ($(gridSelector) as any).dxDataGrid('instance');

    const columnHeadersView = dataGrid.getView('columnHeadersView');
    const originRender = columnHeadersView.renderDelayedTemplates.bind(columnHeadersView);

    // eslint-disable-next-line no-underscore-dangle
    columnHeadersView._templatesCache = {};
    columnHeadersView.renderDelayedTemplates = (changes) => {
      // The templates render after the grid, like asynchronous templates of a framework.
      // eslint-disable-next-line no-restricted-syntax
      setTimeout(() => { originRender(changes); });
    };
  }, selector);
};
