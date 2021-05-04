import { mount } from 'enzyme';
import React from 'react';
import { LayoutManager } from '../layout_manager';
import { LayoutManagerProps } from '../layout_manager_props';
import { ResponsiveBox } from '../../responsive_box/responsive_box';

describe('LayoutManager', () => {
  it('InitialProps', () => {
    const props = new LayoutManagerProps();
    const layoutManager = mount<LayoutManager>(<LayoutManager {...props} />);

    expect(layoutManager.props()).toEqual({});
  });
});

describe('LayoutManager > Markup', () => {
  it('ResponsiveBox is rendered', () => {
    const props = new LayoutManagerProps();
    const layoutManager = mount<LayoutManager>(<LayoutManager {...props} />);

    const responsiveBox = layoutManager.find(ResponsiveBox);
    expect(responsiveBox.exists()).toBe(true);
    expect(responsiveBox.props()).toEqual({
      screenByWidth: undefined,
    });
  });
});

describe('LayoutManager > Getters', () => {
  describe('cssClasses', () => {
    it('Check has dx-layout-manager class', () => {
      const layoutManager = new LayoutManager({});
      expect(layoutManager.cssClasses).toEqual(expect.stringMatching('dx-layout-manager'));
    });
  });
});
