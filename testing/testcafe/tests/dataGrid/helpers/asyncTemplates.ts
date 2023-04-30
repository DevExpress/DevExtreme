import { ClientFunction } from 'testcafe';

export const makeRowsViewTemplatesAsync = async (selector: string): Promise<void> => {
  await ClientFunction(() => {
    const dataGrid = ($(selector) as any).dxDataGrid('instance');

    const rowsView = dataGrid.getView('rowsView');
    const originRender = rowsView.renderDelayedTemplates.bind(rowsView);
    rowsView.renderDelayedTemplates = (changes) => {
      setTimeout(() => { originRender(changes); });
    };
  }, {
    dependencies: { selector },
  })();
};
