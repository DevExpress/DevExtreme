import { describe, expect, it } from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import { getMaxHorizontalScrollOffset, isSameColumnLayout } from '../utils';

const createContainerMock = (
  scrollWidth: number,
  clientWidth: number,
): HTMLElement => ({ scrollWidth, clientWidth } as HTMLElement);

describe('getMaxHorizontalScrollOffset', () => {
  it('returns 0 when the container is not defined', () => {
    expect(getMaxHorizontalScrollOffset(undefined)).toBe(0);
  });

  it('returns the difference between the scroll width and the client width', () => {
    const container = createContainerMock(2000, 995);

    expect(getMaxHorizontalScrollOffset(container)).toBe(1005);
  });

  it('returns 0 when the content does not overflow the container', () => {
    const container = createContainerMock(1000, 1000);

    expect(getMaxHorizontalScrollOffset(container)).toBe(0);
  });

  it('rounds the result', () => {
    const container = createContainerMock(2000.4, 995);

    expect(getMaxHorizontalScrollOffset(container)).toBe(1005);
  });
});

describe('isSameColumnLayout', () => {
  const createColumns = (
    ...columns: Pick<Column, 'index' | 'command'>[]
  ): Column[] => columns.map((column) => ({ ...column } as Column));

  it('accepts new column objects at the same positions', () => {
    const renderedColumns = createColumns({ command: 'select' }, { index: 0 }, { index: 1 });
    const columns = createColumns({ command: 'select' }, { index: 0 }, { index: 1 });

    expect(isSameColumnLayout(renderedColumns, columns)).toBe(true);
  });

  it('accepts no columns', () => {
    expect(isSameColumnLayout([], [])).toBe(true);
  });

  it('rejects a hidden column', () => {
    const renderedColumns = createColumns({ index: 0 }, { index: 1 }, { index: 2 });
    const columns = createColumns({ index: 0 }, { index: 2 });

    expect(isSameColumnLayout(renderedColumns, columns)).toBe(false);
  });

  it('rejects reordered columns', () => {
    const renderedColumns = createColumns({ index: 0 }, { index: 1 });
    const columns = createColumns({ index: 1 }, { index: 0 });

    expect(isSameColumnLayout(renderedColumns, columns)).toBe(false);
  });

  it('rejects a command column in place of a data column', () => {
    const renderedColumns = createColumns({ index: 0 }, { index: 1 });
    const columns = createColumns({ command: 'adaptive' }, { index: 1 });

    expect(isSameColumnLayout(renderedColumns, columns)).toBe(false);
  });
});
