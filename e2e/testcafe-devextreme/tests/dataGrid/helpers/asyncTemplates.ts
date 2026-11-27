import { ClientFunction } from 'testcafe';

export const makeRowsViewTemplatesAsync = async (selector: string, timeout = 0): Promise<void> => {
  await ClientFunction(() => {
    const dataGrid = ($(selector) as any).dxDataGrid('instance');

    const rowsView = dataGrid.getView('rowsView');
    const originRender = rowsView.renderDelayedTemplates.bind(rowsView);

    // eslint-disable-next-line no-underscore-dangle
    rowsView._templatesCache = {};
    rowsView.renderDelayedTemplates = (changes) => {
      setTimeout(() => { originRender(changes); }, timeout);
    };
  }, {
    dependencies: { selector, timeout },
  })();
};
