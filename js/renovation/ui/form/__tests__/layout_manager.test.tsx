import { mount } from 'enzyme';
import React from 'react';
import { LayoutManager } from '../layout_manager';
import { LayoutManagerProps } from '../layout_manager_props';

describe('LayoutManager', () => {
  it('InitialProps', () => {
    const props = new LayoutManagerProps();
    const form = mount<LayoutManager>(<LayoutManager {...props} />);

    expect(form.props()).toEqual({});
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
