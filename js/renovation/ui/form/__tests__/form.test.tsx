import { mount } from 'enzyme';
import React from 'react';
import each from 'jest-each';
import { FormProps } from '../form_props';
import { Form } from '../form';
import { Scrollable } from '../../scroll_view/scrollable';

it('Form > InitialProps', () => {
  const props = new FormProps();
  const form = mount<Form>(<Form {...props} />);

  expect(form.props()).toEqual({
    scrollingEnabled: false,
    useNativeScrolling: undefined,
  });
});

describe('Form > Markup', () => {
  it('Scrollable is not rendered, if scrollingEnabled = false', () => {
    const props = { scrollingEnabled: false } as FormProps;
    const form = mount<Form>(<Form {...props} />);

    const scrollable = form.find(Scrollable);
    expect(scrollable.exists()).toBe(false);
  });

  it('Scrollable is rendered, if scrollingEnabled = true', () => {
    const props = { scrollingEnabled: true } as FormProps;
    const form = mount<Form>(<Form {...props} />);

    const scrollable = form.find(Scrollable);
    expect(scrollable.exists()).toBe(true);
  });

  each([false, true, undefined, null]).describe('scrollingEnabled: %o', (useNativeScrolling) => {
    it('Scrollable params is valid', () => {
      const props = { scrollingEnabled: true, useNativeScrolling } as FormProps;
      const form = mount<Form>(<Form {...props} />);

      const scrollable = form.find(Scrollable);
      expect(scrollable.props()).toEqual({
        useNative: !!useNativeScrolling,
        useSimulatedScrollbar: !useNativeScrolling,
        useKeyboard: false,
        direction: 'both',
        bounceEnabled: false,
        aria: { role: 'form' },
        classes: 'dx-form',
        'rest-attributes': 'restAttributes',
      });
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
