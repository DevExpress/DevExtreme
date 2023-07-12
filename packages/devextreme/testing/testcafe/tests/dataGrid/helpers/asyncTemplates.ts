import { ClientFunction } from 'testcafe';

export const makeRowsViewTemplatesAsync = async (selector: string): Promise<void> => {
  await ClientFunction(() => {
    const dataGrid = ($(selector) as any).dxDataGrid('instance');

    const rowsView = dataGrid.getView('rowsView');
    const originRender = rowsView.renderDelayedTemplates.bind(rowsView);

    // eslint-disable-next-line no-underscore-dangle
    rowsView._templatesCache = {};
    rowsView.renderDelayedTemplates = (changes) => {
      setTimeout(() => { originRender(changes); });
    };
  }, {
    dependencies: { selector },
  })();
};

export const makeColumnHeadersViewTemplatesAsync = async (selector: string): Promise<void> => {
  await ClientFunction(() => {
    const dataGrid = ($(selector) as any).dxDataGrid('instance');

    const columnHeadersView = dataGrid.getView('columnHeadersView');
    const originRender = columnHeadersView.renderDelayedTemplates.bind(columnHeadersView);

    // eslint-disable-next-line no-underscore-dangle
    columnHeadersView._templatesCache = {};
    columnHeadersView.renderDelayedTemplates = (changes) => {
      setTimeout(() => { originRender(changes); });
    };
  }, {
    dependencies: { selector },
  })();
};
