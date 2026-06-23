import {
  describe, expect, it, jest,
} from '@jest/globals';

import { GroupPanelVerticalRow } from './group_panel_vertical_row';

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

interface VirtualNodeLike {
  props?: {
    style?: unknown;
  };
}

describe('GroupPanelVerticalRow', () => {
  it('should apply row height', () => {
    const component = new GroupPanelVerticalRow({
      groupItems: [{
        key: '0',
        id: 0,
        text: 'Group 0',
        data: { id: 0 },
        resourceName: 'ownerId',
      }],
      height: 140,
      className: '',
    });
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.style).toEqual({ height: '140px' });
  });
});
