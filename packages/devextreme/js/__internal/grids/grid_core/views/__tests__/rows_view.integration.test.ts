import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import {
  afterTest, beforeTest, createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

interface TemplateArgs {
  model: { value: unknown };
  container: HTMLElement;
  onRendered?: () => void;
}

const ROWS = Array.from({ length: 6 }, (_, index) => ({ id: index, name: `Row ${index}` }));
const PAGE_SIZE = 3;
const FIRST_PAGE_ROW_KEYS = [0, 1, 2];
const SECOND_PAGE_ROW_KEYS = [3, 4, 5];

const getRowKeys = ($container: dxElementWrapper): number[] => {
  const container = $container.get(0) as HTMLElement;
  const rows = container.querySelectorAll<HTMLTableRowElement>('.dx-datagrid-rowsview tr.dx-data-row');

  return Array.from(rows, (row) => Number(row.cells[0].textContent));
};

describe('RowsView renderCompleted with async templates', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const createGrid = async (isTemplateRenderedAsync: boolean) => {
    const pendingTemplates: (() => void)[] = [];
    const renderPendingTemplates = (): void => {
      while (pendingTemplates.length) {
        pendingTemplates.shift()?.();
        jest.runAllTimers();
      }
    };

    const grid = await createDataGrid({
      dataSource: ROWS,
      paging: { pageSize: PAGE_SIZE },
      columns: ['id', { dataField: 'name', cellTemplate: 'cellTemplate' }],
      templatesRenderAsynchronously: true,
      integrationOptions: {
        templates: {
          cellTemplate: {
            render({ model, container, onRendered }: TemplateArgs): void {
              const renderTemplate = (): void => {
                container.append(String(model.value));
                onRendered?.();
              };

              if (isTemplateRenderedAsync) {
                pendingTemplates.push(renderTemplate);
              } else {
                renderTemplate();
              }
            },
          },
        },
      },
    } as DataGridProperties);
    renderPendingTemplates();

    const rowKeysOnRenderCompleted: number[][] = [];
    grid.instance.getView('rowsView').renderCompleted.add(() => {
      rowKeysOnRenderCompleted.push(getRowKeys(grid.$container));
    });

    return { ...grid, renderPendingTemplates, rowKeysOnRenderCompleted };
  };

  it('should fire renderCompleted only once the new rows waiting for async templates are in the DOM', async () => {
    const { instance, renderPendingTemplates, rowKeysOnRenderCompleted } = await createGrid(true);

    const paging = instance.pageIndex(1);
    jest.runAllTimers();
    await paging;

    expect(rowKeysOnRenderCompleted).toEqual([]);

    renderPendingTemplates();

    expect(rowKeysOnRenderCompleted).toEqual([SECOND_PAGE_ROW_KEYS]);
  });

  it('should fire renderCompleted synchronously when the templates are rendered synchronously', async () => {
    const { instance, rowKeysOnRenderCompleted } = await createGrid(false);

    instance.getView('rowsView').render();

    expect(rowKeysOnRenderCompleted).toEqual([FIRST_PAGE_ROW_KEYS]);
  });
});
