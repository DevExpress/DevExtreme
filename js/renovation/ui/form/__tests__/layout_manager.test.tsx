import { mount } from 'enzyme';
import React from 'react';
import { LayoutManager } from '../layout_manager';
import { FormLayoutManagerProps } from '../layout_manager_props';

describe('FormLayoutManager', () => {
  it('InitialProps', () => {
    const props = new FormLayoutManagerProps();
    const form = mount<LayoutManager>(<LayoutManager {...props} />);

    expect(form.props()).toEqual({
      isRoot: false,
    });
  });
});

describe('FormLayoutManager > Getters', () => {
  describe('cssClasses', () => {
    it('Check has dx-layout-manager class', () => {
      const layoutManager = new LayoutManager({});
      expect(layoutManager.cssClasses).toEqual(expect.stringMatching('dx-layout-manager'));
    });
  });
});
