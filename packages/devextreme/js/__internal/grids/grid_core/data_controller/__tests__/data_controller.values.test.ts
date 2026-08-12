import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, name: 'Alex', age: 15 },
  { id: 2, name: 'Dan', age: 20 },
];

interface ModifiedRow {
  modifiedValues?: unknown[];
}

interface VisibleColumn {
  command?: string;
  dataField?: string;
}

const getVisibleColumns = (instance: DataGridInstance): VisibleColumn[] => instance
  .getController('columns')
  .getVisibleColumns() as VisibleColumn[];

const indexOfCommand = (
  instance: DataGridInstance,
  command: string,
): number => getVisibleColumns(instance).findIndex((column) => column.command === command);

const indexOfDataField = (
  instance: DataGridInstance,
  dataField: string,
): number => getVisibleColumns(instance).findIndex((column) => column.dataField === dataField);

describe('row values generation', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('AI column', () => {
    it('should keep its value when a command column shifts the visible indices', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        columns: [
          'name',
          'age',
          {
            type: 'ai',
            name: 'myAiColumn',
            caption: 'AI Column',
            ai: {
              prompt: 'Initial prompt',
              aiIntegration: new AIIntegration({
                sendRequest: () => ({
                  promise: Promise.resolve('{"1":"AI Response 1","2":"AI Response 2"}'),
                  abort: (): void => {},
                }),
              }),
            },
          },
        ],
        rowDragging: { allowReordering: true },
      });

      await flushAsync();

      const [row] = instance.getVisibleRows();
      const aiIndex = indexOfCommand(instance, 'ai');

      expect(indexOfCommand(instance, 'drag')).toBeGreaterThanOrEqual(0);
      expect(aiIndex).toBeGreaterThan(0);
      expect(row.values[aiIndex]).toBe('AI Response 1');
    });
  });

  describe('modifiedValues in batch edit mode', () => {
    it('should use undefined, not null, for command columns', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        columns: ['name', 'age'],
        rowDragging: { allowReordering: true },
        editing: { mode: 'batch', allowUpdating: true, allowDeleting: true },
      });

      instance.cellValue(0, indexOfDataField(instance, 'name'), 'Modified');
      await flushAsync();

      const [row] = instance.getVisibleRows() as unknown as ModifiedRow[];

      expect(row.modifiedValues).toBeDefined();
      expect(row.modifiedValues?.[indexOfDataField(instance, 'name')]).toBe('Modified');
      expect(row.modifiedValues?.[indexOfCommand(instance, 'drag')]).toBeUndefined();
      expect(row.modifiedValues?.[indexOfCommand(instance, 'edit')]).toBeUndefined();
    });
  });
});
