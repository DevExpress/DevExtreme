import { mount } from 'enzyme';
import React from 'react';
import { FormLayoutManager } from '../form_layout_manager';
import { FormLayoutManagerProps } from '../form_layout_manager_props';

describe('FormLayoutManager', () => {
  it('InitialProps', () => {
    const props = new FormLayoutManagerProps();
    const form = mount<FormLayoutManager>(<FormLayoutManager {...props} />);

    expect(form.props()).toEqual({
      isRoot: false,
    });
  });
});

describe('FormLayoutManager > Getters', () => {
  describe('cssClasses', () => {
    it('Check has dx-layout-manager class', () => {
      const layoutManager = new FormLayoutManager({});
      expect(layoutManager.cssClasses).toEqual(expect.stringMatching('dx-layout-manager'));
    });
  });
});
