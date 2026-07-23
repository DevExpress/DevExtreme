import {
  describe, expect, it,
} from '@jest/globals';

import { GroupPanelVerticalCell } from './group_panel_vertical_cell';

interface VirtualNodeLike {
  props?: {
    title?: string;
    role?: string;
    className?: string;
    'aria-label'?: string;
  };
}

const baseProps = {
  id: 1,
  text: 'Room 1',
  data: { id: 1, text: 'Room 1' },
  index: 0,
};

describe('GroupPanelVerticalCell', () => {
  it('should set a title attribute with the cell text for overflow tooltips', () => {
    const component = new GroupPanelVerticalCell(baseProps);
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.title).toBe('Room 1');
  });

  it('should set basic row-header accessibility attributes', () => {
    const component = new GroupPanelVerticalCell(baseProps);
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.role).toBe('rowheader');
    expect(result.props?.['aria-label']).toBe('Room 1');
  });
});
