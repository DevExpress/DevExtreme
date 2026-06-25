import {
  describe, expect, it, jest,
} from '@jest/globals';

import type { CellTemplateProps } from '../types';
import { DateTableBody } from './date_table_body';
import { Row } from './row';

interface RenderUtilsMock {
  renderUtils: {
    addHeightToStyle: (
      height: number | undefined,
      styles?: Record<string, unknown>,
    ) => Record<string, unknown>;
  };
}

jest.mock('../../utils/index', (): RenderUtilsMock => ({
  renderUtils: {
    addHeightToStyle: (
      height: number | undefined,
      styles: Record<string, unknown> = {},
    ): Record<string, unknown> => (height === undefined ? styles : { ...styles, height }),
  },
}));

const viewContext = {
  view: {
    type: 'day',
  },
  crossScrollingEnabled: false,
} as const;

const CellTemplate = (): JSX.Element => <td />;

interface VirtualNodeLike {
  type?: unknown;
  props?: {
    children?: unknown;
    styles?: unknown;
  };
  children?: unknown;
}

const toArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return value === undefined || value === null ? [] : [value];
};

const getRowNodes = (node: unknown): VirtualNodeLike[] => {
  if (typeof node !== 'object' || node === null) {
    return [];
  }

  const virtualNode = node as VirtualNodeLike;
  const currentNode = virtualNode.type === Row ? [virtualNode] : [];
  const children = [
    ...toArray(virtualNode.children),
    ...toArray(virtualNode.props?.children),
  ];

  return [
    ...currentNode,
    ...children.flatMap(getRowNodes),
  ];
};

const createCell = (
  key: number,
): CellTemplateProps => ({
  key,
  startDate: new Date(2025, 0, 1),
  endDate: new Date(2025, 0, 1, 0, 30),
  index: key,
  isFirstGroupCell: false,
  isLastGroupCell: false,
  isSelected: false,
  isFocused: false,
});

describe('DateTableBody', () => {
  it('should apply row heights', () => {
    const component = new DateTableBody({
      viewContext,
      viewData: {
        groupedData: [{
          dateTable: [
            { key: 0, cells: [createCell(0)] },
            { key: 1, cells: [createCell(1)] },
          ],
          groupIndex: 0,
          key: '0',
        }, {
          dateTable: [
            { key: 2, cells: [createCell(2)] },
          ],
          groupIndex: 1,
          key: '1',
        }],
        leftVirtualCellCount: 0,
        rightVirtualCellCount: 0,
        topVirtualRowCount: 0,
        bottomVirtualRowCount: 0,
      },
      cellTemplate: CellTemplate,
      leftVirtualCellWidth: 0,
      rightVirtualCellWidth: 0,
      topVirtualRowHeight: 0,
      bottomVirtualRowHeight: 0,
      addDateTableClass: true,
      addVerticalSizesClassToRows: true,
      rowHeights: [120, 80, 160],
    });

    const rows = getRowNodes(component.render());

    expect(rows[0].props?.styles).toEqual({ height: 120 });
    expect(rows[1].props?.styles).toEqual({ height: 80 });
    expect(rows[2].props?.styles).toEqual({ height: 160 });
  });
});
