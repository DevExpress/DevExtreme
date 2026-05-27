import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Properties } from '@js/ui/data_grid';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../../__tests__/__mock__/helpers/utils';
import {
  columnsPinningCommand,
  columnsReorderCommand,
  columnsResizeCommand,
  columnsVisibilityCommand,
} from '../columns';

const createCallbacks = (): {
  success: jest.Mock<(message?: string) => CommandResult>;
  failure: jest.Mock<(message?: string) => CommandResult>;
} => ({
  success: jest.fn((message?: string) => ({ status: 'success' as const, message: message ?? '' })),
  failure: jest.fn((message?: string) => ({ status: 'failure' as const, message: message ?? '' })),
});

const createGrid = async (
  options: Record<string, unknown> = {},
): Promise<InternalGrid> => {
  const { instance } = await createDataGrid({
    dataSource: [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
    ],
    columns: [
      { dataField: 'id', dataType: 'number' },
      { dataField: 'name', caption: 'Full Name', dataType: 'string' },
    ],
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnFixing: { enabled: true },
    columnChooser: { enabled: true },
    ...options,
  } as unknown as Properties);
  return instance as unknown as InternalGrid;
};

describe('columnsVisibilityCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      [true],
      [false],
    ])('accepts valid args with visible "%s"', (visible) => {
      expect(columnsVisibilityCommand.schema.safeParse({
        dataField: 'name',
        visible,
      }).success).toBe(true);
    });

    it('rejects when dataField is missing', () => {
      expect(columnsVisibilityCommand.schema.safeParse({ visible: true }).success).toBe(false);
    });

    it('rejects when visible is missing', () => {
      expect(columnsVisibilityCommand.schema.safeParse({ dataField: 'name' }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(columnsVisibilityCommand.schema.safeParse({
        dataField: 'name',
        visible: true,
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when columnChooser.enabled is not true', async () => {
      const instance = await createGrid({ columnChooser: { enabled: false } });
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'name',
        visible: false,
      });

      expect(result.status).toBe('failure');
      const setCalls = spy.mock.calls.filter(
        (callArgs) => callArgs.length === 3 && callArgs[1] === 'visible',
      );
      expect(setCalls).toHaveLength(0);
    });

    it('returns failure when dataField does not match any column', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      const result = await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        visible: false,
      });

      expect(result.status).toBe('failure');
    });

    it('returns failure when hiding a column with allowHiding=false', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', allowHiding: false,
          },
        ],
      });
      const callbacks = createCallbacks();

      const result = await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'name',
        visible: false,
      });

      expect(result.status).toBe('failure');
      expect(callbacks.failure).toHaveBeenCalledWith('Hide the column "Full Name".');
    });

    it('allows showing a column even when allowHiding=false', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', allowHiding: false, visible: false,
          },
        ],
      });
      const callbacks = createCallbacks();

      const result = await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'name',
        visible: true,
      });

      expect(result.status).toBe('success');
    });

    it('calls columnsController.columnOption(index, "visible", value) on success', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const nameColumn = columnsController.columnOption('name') as { index: number };
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'name',
        visible: false,
      });

      expect(spy).toHaveBeenCalledWith(nameColumn.index, 'visible', false);
      expect(result.status).toBe('success');
    });

    it('returns failure when columnOption throws', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const realColumnOption = columnsController.columnOption.bind(columnsController);
      jest.spyOn(columnsController, 'columnOption').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs.length === 3 && callArgs[1] === 'visible') {
          throw new Error('Error');
        }
        return (realColumnOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const callbacks = createCallbacks();

      const result = await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'name',
        visible: false,
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses caption with "Display" wording for visible=true', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', visible: false,
          },
        ],
      });
      const callbacks = createCallbacks();

      await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'name',
        visible: true,
      });

      expect(callbacks.success).toHaveBeenCalledWith('Display the column "Full Name".');
    });

    it('uses caption with "Hide" wording for visible=false', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'name',
        visible: false,
      });

      expect(callbacks.success).toHaveBeenCalledWith('Hide the column "Full Name".');
    });

    it('falls back to dataField when no column matches', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await columnsVisibilityCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        visible: false,
      });

      expect(callbacks.failure).toHaveBeenCalledWith('Hide the column "unknown".');
    });
  });
});

describe('columnsReorderCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts valid args', () => {
      expect(columnsReorderCommand.schema.safeParse({
        dataField: 'name',
        visibleIndex: 0,
      }).success).toBe(true);
    });

    it('rejects when dataField is missing', () => {
      expect(columnsReorderCommand.schema.safeParse({
        visibleIndex: 0,
      }).success).toBe(false);
    });

    it('rejects negative visibleIndex', () => {
      expect(columnsReorderCommand.schema.safeParse({
        dataField: 'name',
        visibleIndex: -1,
      }).success).toBe(false);
    });

    it('rejects non-integer visibleIndex', () => {
      expect(columnsReorderCommand.schema.safeParse({
        dataField: 'name',
        visibleIndex: 1.5,
      }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(columnsReorderCommand.schema.safeParse({
        dataField: 'name',
        visibleIndex: 0,
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when allowColumnReordering is not true on the grid', async () => {
      const instance = await createGrid({ allowColumnReordering: false });
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsReorderCommand.execute(instance, callbacks)({
        dataField: 'name',
        visibleIndex: 0,
      });

      expect(result.status).toBe('failure');
      const setCalls = spy.mock.calls.filter(
        (callArgs) => callArgs.length === 3 && callArgs[1] === 'visibleIndex',
      );
      expect(setCalls).toHaveLength(0);
    });

    it('returns failure when dataField does not match', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      const result = await columnsReorderCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        visibleIndex: 0,
      });

      expect(result.status).toBe('failure');
    });

    it('returns failure when allowReordering is false', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', allowReordering: false,
          },
        ],
      });
      const callbacks = createCallbacks();

      const result = await columnsReorderCommand.execute(instance, callbacks)({
        dataField: 'name',
        visibleIndex: 0,
      });

      expect(result.status).toBe('failure');
    });

    it('calls columnsController.columnOption(index, "visibleIndex", value) on success', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const nameColumn = columnsController.columnOption('name') as { index: number };
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsReorderCommand.execute(instance, callbacks)({
        dataField: 'name',
        visibleIndex: 0,
      });

      expect(spy).toHaveBeenCalledWith(nameColumn.index, 'visibleIndex', 0);
      expect(result.status).toBe('success');
    });

    it('returns failure when columnOption throws', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const realColumnOption = columnsController.columnOption.bind(columnsController);
      jest.spyOn(columnsController, 'columnOption').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs.length === 3 && callArgs[1] === 'visibleIndex') {
          throw new Error('Error');
        }
        return (realColumnOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const callbacks = createCallbacks();

      const result = await columnsReorderCommand.execute(instance, callbacks)({
        dataField: 'name',
        visibleIndex: 0,
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('renders position as 1-based even though visibleIndex is 0-based', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await columnsReorderCommand.execute(instance, callbacks)({
        dataField: 'name',
        visibleIndex: 0,
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Move the column "Full Name" to position 1.',
      );
    });

    it('falls back to dataField when no column matches', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await columnsReorderCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        visibleIndex: 2,
      });

      expect(callbacks.failure).toHaveBeenCalledWith(
        'Move the column "unknown" to position 3.',
      );
    });
  });
});

describe('columnsPinningCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts fixed=true with fixedPosition', () => {
      expect(columnsPinningCommand.schema.safeParse({
        dataField: 'name',
        fixed: true,
        fixedPosition: 'left',
      }).success).toBe(true);
    });

    it('accepts fixed=true without fixedPosition', () => {
      expect(columnsPinningCommand.schema.safeParse({
        dataField: 'name',
        fixed: true,
      }).success).toBe(true);
    });

    it('accepts fixed=false without fixedPosition', () => {
      expect(columnsPinningCommand.schema.safeParse({
        dataField: 'name',
        fixed: false,
      }).success).toBe(true);
    });

    it('accepts fixed=false with fixedPosition (ignored at execute time)', () => {
      expect(columnsPinningCommand.schema.safeParse({
        dataField: 'name',
        fixed: false,
        fixedPosition: 'left',
      }).success).toBe(true);
    });

    it('accepts fixedPosition=null and parses it to undefined', () => {
      const result = columnsPinningCommand.schema.safeParse({
        dataField: 'name',
        fixed: true,
        fixedPosition: null,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fixedPosition).toBeUndefined();
      }
    });

    it('rejects when dataField is missing', () => {
      expect(columnsPinningCommand.schema.safeParse({
        fixed: true,
        fixedPosition: 'left',
      }).success).toBe(false);
    });

    it('rejects when fixed is missing', () => {
      expect(columnsPinningCommand.schema.safeParse({
        dataField: 'name',
        fixedPosition: 'left',
      }).success).toBe(false);
    });

    it('rejects an unknown fixedPosition', () => {
      expect(columnsPinningCommand.schema.safeParse({
        dataField: 'name',
        fixed: true,
        fixedPosition: 'top',
      }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(columnsPinningCommand.schema.safeParse({
        dataField: 'name',
        fixed: false,
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when columnFixing.enabled is not true', async () => {
      const instance = await createGrid({ columnFixing: { enabled: false } });
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'name',
        fixed: true,
        fixedPosition: 'left',
      });

      expect(result.status).toBe('failure');
      const setCalls = spy.mock.calls.filter(
        (callArgs) => callArgs.length === 2 && typeof callArgs[1] === 'object',
      );
      expect(setCalls).toHaveLength(0);
    });

    it('returns failure when dataField does not match', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      const result = await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        fixed: true,
        fixedPosition: 'left',
      });

      expect(result.status).toBe('failure');
    });

    it('returns failure when allowFixing is false', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', allowFixing: false,
          },
        ],
      });
      const callbacks = createCallbacks();

      const result = await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'name',
        fixed: true,
        fixedPosition: 'left',
      });

      expect(result.status).toBe('failure');
    });

    it('pins by calling columnOption(index, { fixed: true, fixedPosition }) on success', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const nameColumn = columnsController.columnOption('name') as { index: number };
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'name',
        fixed: true,
        fixedPosition: 'right',
      });

      expect(spy).toHaveBeenCalledWith(nameColumn.index, {
        fixed: true,
        fixedPosition: 'right',
      });
      expect(result.status).toBe('success');
    });

    it('unpins by calling columnOption(index, { fixed: false, fixedPosition: undefined }) on success', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', fixed: true, fixedPosition: 'left',
          },
        ],
      });
      const columnsController = instance.getController('columns');
      const nameColumn = columnsController.columnOption('name') as { index: number };
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'name',
        fixed: false,
      });

      expect(spy).toHaveBeenCalledWith(nameColumn.index, {
        fixed: false,
        fixedPosition: undefined,
      });
      expect(result.status).toBe('success');
    });

    it('drops fixedPosition from the patch when fixed=false', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const nameColumn = columnsController.columnOption('name') as { index: number };
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'name',
        fixed: false,
        fixedPosition: 'left',
      });

      expect(spy).toHaveBeenCalledWith(nameColumn.index, {
        fixed: false,
        fixedPosition: undefined,
      });
    });

    it('returns failure when columnOption throws', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const realColumnOption = columnsController.columnOption.bind(columnsController);
      jest.spyOn(columnsController, 'columnOption').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs.length === 2 && typeof callArgs[1] === 'object' && callArgs[1] !== null) {
          throw new Error('Error');
        }
        return (realColumnOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const callbacks = createCallbacks();

      const result = await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'name',
        fixed: true,
        fixedPosition: 'left',
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses "Fix the column …" for fixed=true', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'name',
        fixed: true,
        fixedPosition: 'left',
      });

      expect(callbacks.success).toHaveBeenCalledWith('Fix the column "Full Name".');
    });

    it('uses "Unfix the column …" for fixed=false', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'name',
        fixed: false,
      });

      expect(callbacks.success).toHaveBeenCalledWith('Unfix the column "Full Name".');
    });

    it('falls back to dataField when no column matches', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await columnsPinningCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        fixed: true,
        fixedPosition: 'right',
      });

      expect(callbacks.failure).toHaveBeenCalledWith('Fix the column "unknown".');
    });
  });
});

describe('columnsResizeCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts numeric width', () => {
      expect(columnsResizeCommand.schema.safeParse({
        dataField: 'name',
        width: 120,
      }).success).toBe(true);
    });

    it('accepts string width', () => {
      expect(columnsResizeCommand.schema.safeParse({
        dataField: 'name',
        width: 'auto',
      }).success).toBe(true);
    });

    it('rejects when dataField is missing', () => {
      expect(columnsResizeCommand.schema.safeParse({
        width: 100,
      }).success).toBe(false);
    });

    it('rejects when width is missing', () => {
      expect(columnsResizeCommand.schema.safeParse({ dataField: 'name' }).success).toBe(false);
    });

    it('rejects when width is a boolean', () => {
      expect(columnsResizeCommand.schema.safeParse({
        dataField: 'name',
        width: true,
      }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(columnsResizeCommand.schema.safeParse({
        dataField: 'name',
        width: 100,
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when allowColumnResizing is not true on the grid', async () => {
      const instance = await createGrid({ allowColumnResizing: false });
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsResizeCommand.execute(instance, callbacks)({
        dataField: 'name',
        width: 120,
      });

      expect(result.status).toBe('failure');
      const setCalls = spy.mock.calls.filter(
        (callArgs) => callArgs.length === 3 && callArgs[1] === 'width',
      );
      expect(setCalls).toHaveLength(0);
    });

    it('returns failure when dataField does not match', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      const result = await columnsResizeCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        width: 120,
      });

      expect(result.status).toBe('failure');
    });

    it('returns failure when allowResizing is false', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', allowResizing: false,
          },
        ],
      });
      const callbacks = createCallbacks();

      const result = await columnsResizeCommand.execute(instance, callbacks)({
        dataField: 'name',
        width: 120,
      });

      expect(result.status).toBe('failure');
    });

    it('calls columnsController.columnOption(index, "width", value) on success', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const nameColumn = columnsController.columnOption('name') as { index: number };
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await columnsResizeCommand.execute(instance, callbacks)({
        dataField: 'name',
        width: 120,
      });

      expect(spy).toHaveBeenCalledWith(nameColumn.index, 'width', 120);
      expect(result.status).toBe('success');
    });

    it('returns failure when columnOption throws', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const realColumnOption = columnsController.columnOption.bind(columnsController);
      jest.spyOn(columnsController, 'columnOption').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs.length === 3 && callArgs[1] === 'width') {
          throw new Error('Error');
        }
        return (realColumnOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const callbacks = createCallbacks();

      const result = await columnsResizeCommand.execute(instance, callbacks)({
        dataField: 'name',
        width: 120,
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses caption and numeric width', async () => {
      const instance = await createGrid({ allowColumnResizing: true });
      const callbacks = createCallbacks();

      await columnsResizeCommand.execute(instance, callbacks)({
        dataField: 'name',
        width: 120,
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Change the "Full Name" column width to 120.',
      );
    });

    it('uses caption and string width', async () => {
      const instance = await createGrid({ allowColumnResizing: true });
      const callbacks = createCallbacks();

      await columnsResizeCommand.execute(instance, callbacks)({
        dataField: 'name',
        width: 'auto',
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Change the "Full Name" column width to auto.',
      );
    });

    it('falls back to dataField when no column matches', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await columnsResizeCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        width: 120,
      });

      expect(callbacks.failure).toHaveBeenCalledWith(
        'Change the "unknown" column width to 120.',
      );
    });
  });
});
