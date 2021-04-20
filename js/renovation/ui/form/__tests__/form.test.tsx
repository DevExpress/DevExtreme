import { mount } from 'enzyme';
import React from 'react';
import each from 'jest-each';
import { FormProps } from '../form_props';
import { Form } from '../form';

describe('Form', () => {
  it('InitialProps', () => {
    const props = new FormProps();
    const form = mount<Form>(<Form {...props} />);

    expect(form.props()).toEqual({
      scrollingEnabled: false,
      useNativeScrolling: undefined,
    });
  });
});

describe('Form > Getters', () => {
  each([false, true]).describe('scrollingEnabled: %o', (scrollingEnabled) => {
    describe('cssClasses', () => {
      it('Check has dx-form class', () => {
        const form = new Form({ scrollingEnabled });
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
