import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture`Ai Column.Virtual Scrolling.Functional`
  .page(url(__dirname, '../../../container-ai-integration.html'));

const DATA_GRID_SELECTOR = '#container';

const checkAIColumnTexts = async (
  t: TestController,
  component: DataGrid,
  expectedRowCount: number,
): Promise<void> => {
  const visibleRows: Record<string, any>[] = await component.apiGetVisibleRows();

  await t.expect(visibleRows.length).eql(expectedRowCount);

  // eslint-disable-next-line no-restricted-syntax
  for (const row of visibleRows) {
    await t
      .expect(component.getDataCell(row.dataIndex, 3).element.textContent)
      .eql(`Response ${row.data.name}`);
  }
};

const resolveAIRequest = ClientFunction((): void => {
  const { aiResponseData } = (window as any);
  const { aiResolve } = (window as any);

  if (aiResponseData && aiResolve) {
    aiResolve(aiResponseData);

    (window as any).aiResponseData = null;
    (window as any).aiResolve = null;
  }
});

const deleteGlobalVariables = ClientFunction((): void => {
  delete (window as any).aiResponseData;
  delete (window as any).aiResolve;
});

test('DataGrid should send an AI request for rendered rows after scrolling without changing the page index', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.getLoadPanel().isVisible())
    .ok();

  // act
  await resolveAIRequest();

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getLoadPanel().isVisible())
    .notOk();
  await checkAIColumnTexts(t, dataGrid, 11);

  // act
  await dataGrid.scrollTo(t, { y: 1000 });

  // assert
  await t
    .expect(dataGrid.getScrollTop())
    .eql(1000)
    .expect(dataGrid.apiPageIndex())
    .eql(0)
    .expect(dataGrid.getDataCell(20, 0).element.textContent)
    .eql('21')
    .expect(dataGrid.getLoadPanel().isVisible())
    .ok();

  // act
  await resolveAIRequest();

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getLoadPanel().isVisible())
    .notOk();
  await checkAIColumnTexts(t, dataGrid, 12);
})
  .before(async () => createWidget('dxDataGrid', () => {
    const generateData = (rowCount: number): Record<string, number | string>[] => {
      const result: Record<string, number | string>[] = [];

      for (let i = 0; i < rowCount; i += 1) {
        result.push({ id: i + 1, name: `Name ${i + 1}`, value: (i + 1) * 10 });
      }

      return result;
    };

    return {
      dataSource: generateData(200),
      height: 500,
      keyExpr: 'id',
      paging: {
        pageSize: 50,
      },
      scrolling: {
        mode: 'virtual',
      },
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            prompt: 'Initial prompt',
            // eslint-disable-next-line new-cap
            aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
              sendRequest(prompt) {
                return {
                  promise: new Promise<string>((resolve) => {
                    const result: Record<string, string> = {};

                    Object.entries(prompt.data?.data).forEach(([key, value]) => {
                      result[key] = `Response ${(value as any).name}`;
                    });

                    (window as any).aiResponseData = JSON.stringify(result);
                    (window as any).aiResolve = resolve;
                  }),
                  abort: (): void => {},
                };
              },
            }),
          },
        },
      ],
    };
  }))
  .after(async () => {
    await deleteGlobalVariables();
  });

test('DataGrid should send an AI request for rendered rows after scrolling with changing the page index', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.getLoadPanel().isVisible())
    .ok();

  // act
  await resolveAIRequest();

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getLoadPanel().isVisible())
    .notOk();
  await checkAIColumnTexts(t, dataGrid, 11);

  // act
  await dataGrid.scrollTo(t, { y: 1000 });

  // assert
  await t
    .expect(dataGrid.getScrollTop())
    .eql(1000)
    .expect(dataGrid.apiPageIndex())
    .eql(1)
    .expect(dataGrid.getDataCell(20, 0).element.textContent)
    .eql('21')
    .expect(dataGrid.getLoadPanel().isVisible())
    .ok();

  // act
  await resolveAIRequest();

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getLoadPanel().isVisible())
    .notOk();
  await checkAIColumnTexts(t, dataGrid, 12);
})
  .before(async () => createWidget('dxDataGrid', () => {
    const generateData = (rowCount: number): Record<string, number | string>[] => {
      const result: Record<string, number | string>[] = [];

      for (let i = 0; i < rowCount; i += 1) {
        result.push({ id: i + 1, name: `Name ${i + 1}`, value: (i + 1) * 10 });
      }

      return result;
    };

    return {
      dataSource: generateData(200),
      height: 500,
      keyExpr: 'id',
      paging: {
        pageSize: 20,
      },
      scrolling: {
        mode: 'virtual',
      },
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            prompt: 'Initial prompt',
            // eslint-disable-next-line new-cap
            aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
              sendRequest(prompt) {
                return {
                  promise: new Promise<string>((resolve) => {
                    const result: Record<string, string> = {};

                    Object.entries(prompt.data?.data).forEach(([key, value]) => {
                      result[key] = `Response ${(value as any).name}`;
                    });

                    (window as any).aiResponseData = JSON.stringify(result);
                    (window as any).aiResolve = resolve;
                  }),
                  abort: (): void => {},
                };
              },
            }),
          },
        },
      ],
    };
  }))
  .after(async () => {
    await deleteGlobalVariables();
  });
