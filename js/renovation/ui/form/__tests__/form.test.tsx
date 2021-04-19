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
});
