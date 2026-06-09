import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';
import { selectionByIndexesCommand } from '@ts/grids/grid_core/ai_assistant/commands/selection';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

const CONTAINER_ID = 'treeListContainer';

// node 1 (root) → node 2 (child); node 3 (root). Depth-first key order: 1, 2, 3.
const items = [
  { id: 1, parentId: 0, name: 'Name 1' },
  { id: 2, parentId: 1, name: 'Name 2' },
  { id: 3, parentId: 0, name: 'Name 3' },
];

const createCallbacks = (): {
  success: jest.Mock<(message?: string) => CommandResult>;
  failure: jest.Mock<(message?: string) => CommandResult>;
} => ({
  success: jest.fn((message?: string) => ({ status: 'success' as const, message: message ?? '' })),
  failure: jest.fn((message?: string) => ({ status: 'failure' as const, message: message ?? '' })),
});

const createTreeList = (
  options: TreeListProperties = {},
): Promise<InternalGrid> => new Promise((resolve) => {
  const $container = $('<div>').attr('id', CONTAINER_ID).appendTo(document.body);

  const instance = new TreeList($container.get(0) as HTMLDivElement, {
    dataSource: items,
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    autoExpandAll: true,
    selection: { mode: 'multiple' },
    ...options,
  });

  jest.runAllTimers();

  resolve(instance as unknown as InternalGrid);
});

describe('selectionByIndexesCommand on TreeList — "allPages" scope', () => {
  beforeEach(async () => jest.useFakeTimers());

  afterEach(() => {
    const $container = $(`#${CONTAINER_ID}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (($container as any).dxTreeList('instance') as TreeList | undefined)?.dispose();
    $container.remove();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('resolves keys by walking the node tree (no loadAll pipeline crash)', async () => {
    const instance = await createTreeList();
    const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
    const callbacks = createCallbacks();

    const result = await selectionByIndexesCommand.execute(instance, callbacks)({
      indexes: [1, 3], mode: 'select', scope: 'allPages',
    });

    // Depth-first node keys are [1, 2, 3]; positions 1 and 3 are keys 1 and 3.
    expect(selectSpy).toHaveBeenCalledWith([1, 3], true);
    expect(result.status).toBe('success');
  });

  it('returns failure when an index exceeds the loaded node count', async () => {
    const instance = await createTreeList();
    const selectSpy = jest.spyOn(instance, 'selectRows');
    const callbacks = createCallbacks();

    const result = await selectionByIndexesCommand.execute(instance, callbacks)({
      indexes: [99], mode: 'select', scope: 'allPages',
    });

    expect(result.status).toBe('failure');
    expect(selectSpy).not.toHaveBeenCalled();
  });
});
