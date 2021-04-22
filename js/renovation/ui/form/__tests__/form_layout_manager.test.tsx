import { mount } from 'enzyme';
import React from 'react';
import { FormLayoutManager } from '../form_layout_manager';
import { FormLayoutManagerProps } from '../form_layout_manager_props';

describe('FormLayoutManager', () => {
  it('InitialProps', () => {
    const props = new FormLayoutManagerProps();
    const form = mount<FormLayoutManager>(<FormLayoutManager {...props} />);

    expect(form.props()).toEqual({});
  });
});

describe('FormLayoutManager > Getters', () => {
  describe('cssClasses', () => {
    it('Check has dx-layout-manager class', () => {
      const form = new FormLayoutManager({});
      expect(form.cssClasses).toEqual(expect.stringMatching('dx-layout-manager'));
    });
  });
});
