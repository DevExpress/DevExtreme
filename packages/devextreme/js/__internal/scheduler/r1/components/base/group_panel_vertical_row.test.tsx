import {
  describe, expect, it,
} from '@jest/globals';

import { GroupPanelVerticalRow } from './group_panel_vertical_row';

interface VirtualNodeLike {
  className?: string;
  children?: VirtualNodeLike | VirtualNodeLike[];
}

const toChildrenArray = (
  children: VirtualNodeLike | VirtualNodeLike[] | undefined,
): VirtualNodeLike[] => {
  if (!children) {
    return [];
  }

  return Array.isArray(children) ? children : [children];
};

describe('GroupPanelVerticalRow', () => {
  it('should render one group row with a cell per group item', () => {
    const component = new GroupPanelVerticalRow({
      groupItems: [
        {
          id: 1, text: 'a', key: 'one_1', resourceIndex: 'one', data: { id: 1, text: 'a' }, colSpan: 2,
        },
        {
          id: 2, text: 'b', key: 'one_2', resourceIndex: 'one', data: { id: 2, text: 'b' }, colSpan: 2,
        },
      ],
    });
    const result = component.render() as VirtualNodeLike;

    expect(result.className).toContain('dx-scheduler-group-row');
    expect(toChildrenArray(result.children)).toHaveLength(2);
  });
});
