import React from 'react';
import { mount } from 'enzyme';

import {
  RefObject,
} from '@devextreme-generator/declarations';

import {
  ScrollViewLoadPanel,
} from '../load_panel';
import { ScrollViewLoadPanelProps } from '../../common/scrollview_loadpanel_props';

describe('LoadPanel integration', () => {
  it('render with defaults', () => {
    const props = new ScrollViewLoadPanelProps();
    const viewModel = mount<ScrollViewLoadPanel>(<ScrollViewLoadPanel {...props} />);

    expect(viewModel.props()).toEqual({
      visible: false,
    });
  });

  describe('Getters', () => {
    it('position, targetElement: undefined', () => {
      const viewModel = new ScrollViewLoadPanel({ });

      expect(viewModel.position).toEqual(undefined);
    });

    it('position, targetElement is scrollableRef', () => {
      const scrollableElement = { width: '100' };
      const scrollableRef = { current: { width: '100' } } as RefObject;

      const viewModel = new ScrollViewLoadPanel({ targetElement: scrollableRef });

      expect(viewModel.position).toEqual({ of: scrollableElement });
    });
  });
});
