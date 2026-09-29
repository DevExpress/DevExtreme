import {
  describe, expect, it,
} from '@jest/globals';

import type { ResourceCellTemplateData } from '../types';
import type { GroupPanelHorizontalCellProps } from './group_panel_horizontal_cell';
import { GroupPanelHorizontalCell } from './group_panel_horizontal_cell';

interface VirtualNodeLike {
  className?: string;
  props?: {
    colspan?: number;
    rowspan?: number;
    title?: string;
    scope?: string;
    role?: string;
    templateProps?: { data: ResourceCellTemplateData };
  };
  children?: VirtualNodeLike | VirtualNodeLike[];
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

  it('should keep the group separator border on a cell that does not reach the last column', () => {
    const component = new GroupPanelHorizontalCell({ ...baseProps, isLastColumn: false });
    const result = component.render() as VirtualNodeLike;

    expect(result.className).toContain('dx-scheduler-group-header-inner-column');
  });

  it('should not mark a cell that reaches the last column', () => {
    const component = new GroupPanelHorizontalCell({ ...baseProps, isLastColumn: true });
    const result = component.render() as VirtualNodeLike;

    expect(result.className).not.toContain('dx-scheduler-group-header-inner-column');
  });

  describe('resourceCellTemplate', () => {
    const cellTemplate = (): JSX.Element => <div />;

    const renderTemplateData = (
      props: Partial<GroupPanelHorizontalCellProps>,
    ): ResourceCellTemplateData => {
      const result = new GroupPanelHorizontalCell({
        ...baseProps, ...props, cellTemplate,
      }).render() as VirtualNodeLike;
      const content = result.children as VirtualNodeLike;
      const templateNode = (Array.isArray(content.children)
        ? content.children[0]
        : content.children) as VirtualNodeLike;

      return templateNode.props?.templateProps?.data as ResourceCellTemplateData;
    };

    it('should pass hierarchy-aware data to a parent header cell template', () => {
      const buildingPathItem = {
        id: 'A', text: 'Building A', resourceIndex: 'buildingId', data: { id: 'A', text: 'Building A' },
      };
      const templateData = renderTemplateData({
        id: 'A',
        text: 'Building A',
        data: { id: 'A', text: 'Building A' },
        resourceIndex: 'buildingId',
        isLeaf: false,
        path: [buildingPathItem],
      });

      expect(templateData).toEqual({
        data: { id: 'A', text: 'Building A' },
        id: 'A',
        text: 'Building A',
        color: undefined,
        resourceIndex: 'buildingId',
        level: 0,
        isLeaf: false,
        path: [buildingPathItem],
      });
    });
  });
});
