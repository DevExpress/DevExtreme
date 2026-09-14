import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { flushAsync } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from '../../__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, parentId: 0, value: 'a' },
  { id: 2, parentId: 1, value: 'b' },
];

interface InitNewRowEvent {
  data: Record<string, unknown>;
}

const addRowAndReadNewData = async (
  keyExpr: string | undefined,
): Promise<Record<string, unknown>> => {
  const onInitNewRow = jest.fn<(e: InitNewRowEvent) => void>();

  // A store built from a plain object option carries no key, unlike the array shorthand, which
  // copies keyExpr onto the store it generates.
  const { instance } = await createTreeList({
    dataSource: { store: { type: 'array', data: DATA } },
    keyExpr,
    editing: { mode: 'row', allowAdding: true },
    onInitNewRow,
  });

  const added = instance.addRow();
  await flushAsync();
  await added;

  expect(onInitNewRow).toHaveBeenCalledTimes(1);

  return onInitNewRow.mock.calls[0][0].data;
};

describe('TreeList adds a generated key to a new row the store cannot identify', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  // TreeList answers key() from its key expression, which always resolves — to 'id' by default.
  // Only the store knows whether it can identify a row, so _addRow has to ask the store.
  it('generates __KEY__ when the store declares no key', async () => {
    const data = await addRowAndReadNewData(undefined);

    expect(data.__KEY__).toEqual(expect.any(String));
  });

  it('generates __KEY__ even when a key expression is declared, because the store still has none', async () => {
    const data = await addRowAndReadNewData('id');

    expect(data.__KEY__).toEqual(expect.any(String));
  });
});

describe('TreeList leaves a new row alone when the store can identify it', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('does not generate __KEY__ for a keyed store', async () => {
    const onInitNewRow = jest.fn<(e: InitNewRowEvent) => void>();
    const { instance } = await createTreeList({
      dataSource: { store: { type: 'array', data: DATA, key: 'id' } },
      editing: { mode: 'row', allowAdding: true },
      onInitNewRow,
    });

    const added = instance.addRow();
    await flushAsync();
    await added;

    expect(onInitNewRow).toHaveBeenCalledTimes(1);
    expect(onInitNewRow.mock.calls[0][0].data).not.toHaveProperty('__KEY__');
  });
});
