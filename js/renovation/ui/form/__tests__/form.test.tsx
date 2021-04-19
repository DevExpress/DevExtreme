import { mount } from 'enzyme';
import React from 'react';
import { FormProps } from '../form_props';
import { Form } from '../form';

describe('Form', () => {
  it('InitialProps', () => {
    const props = new FormProps();
    const form = mount<Form>(<Form {...props} />);

    expect(form.props()).toEqual({});
  });

  describe('Getters', () => {
    describe('cssClasses', () => {
      it('Check has dx-form class', () => {
        const form = new Form({});
        expect(form.cssClasses).toEqual(expect.stringMatching('dx-form'));
      });
    });

    describe('aria', () => {
      it('Check has form role', () => {
        const form = new Form({});
        expect(form.aria).toEqual({ role: 'form' });
      });
    });
  });
});
