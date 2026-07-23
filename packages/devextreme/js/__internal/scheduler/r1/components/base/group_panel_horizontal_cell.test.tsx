import {
  describe, expect, it,
} from '@jest/globals';

import { GroupPanelHorizontalCell } from './group_panel_horizontal_cell';

interface VirtualNodeLike {
  props?: {
    colspan?: number;
    rowspan?: number;
    title?: string;
    scope?: string;
    role?: string;
    className?: string;
  };
}

const baseProps = {
  id: 1,
  text: 'Room 1',
  data: { id: 1, text: 'Room 1' },
  index: 0,
  colSpan: 3,
  isFirstGroupCell: false,
  isLastGroupCell: false,
};

describe('GroupPanelHorizontalCell', () => {
  it('should render colSpan and omit rowSpan when it is not provided', () => {
    const component = new GroupPanelHorizontalCell(baseProps);
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.colspan).toBe(3);
    expect(result.props?.rowspan).toBeUndefined();
  });

  it('should render rowSpan when greater than 1 (shallow leaf filling missing depth rows)', () => {
    const component = new GroupPanelHorizontalCell({ ...baseProps, rowSpan: 2 });
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.rowspan).toBe(2);
  });

  it('should omit rowSpan attribute when it equals 1', () => {
    const component = new GroupPanelHorizontalCell({ ...baseProps, rowSpan: 1 });
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.rowspan).toBeUndefined();
  });

  it('should set a title attribute with the cell text for overflow tooltips', () => {
    const component = new GroupPanelHorizontalCell(baseProps);
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.title).toBe('Room 1');
  });

  it('should set scope="colgroup" when colSpan is greater than 1', () => {
    const component = new GroupPanelHorizontalCell(baseProps);
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.scope).toBe('colgroup');
    expect(result.props?.role).toBe('columnheader');
  });

  it('should set scope="col" when colSpan equals 1', () => {
    const component = new GroupPanelHorizontalCell({ ...baseProps, colSpan: 1 });
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.scope).toBe('col');
    expect(result.props?.role).toBe('columnheader');
  });
});
