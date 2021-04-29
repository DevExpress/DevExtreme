import { mount } from 'enzyme';
import React from 'react';
import each from 'jest-each';
import { FormProps } from '../form_props';
import { Form } from '../form';
import { Scrollable } from '../../scroll_view/scrollable';
import { LayoutManager } from '../form_layout_manager';

it('Form > InitialProps', () => {
  const props = new FormProps();
  const form = mount<Form>(<Form {...props} />);

  expect(form.props()).toEqual({
    scrollingEnabled: false,
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
      expect(scrollable.props()).toEqual(expect.objectContaining({
        aria: { role: 'form' },
        bounceEnabled: false,
        classes: 'dx-form',
        direction: 'both',
        useKeyboard: false,
        useNative: !!useNativeScrolling,
        useSimulatedScrollbar: !useNativeScrolling,
      }));
    });
  });

  each([false, true]).describe('scrollingEnabled: %o', (scrollingEnabled) => {
    each([false, true, undefined, null]).describe('scrollingEnabled: %o', (useNativeScrolling) => {
      it('root layoutManager is rendered', () => {
        const props = { scrollingEnabled, useNativeScrolling } as FormProps;
        const form = mount<Form>(<Form {...props} />);

        const layoutManager = form.find(LayoutManager);
        expect(layoutManager.exists()).toEqual(true);
      });
    });
  });
});

describe('Form > Attrs', () => {
  each([false, true]).describe('scrollingEnabled: %o', (scrollingEnabled) => {
    describe('cssClasses', () => {
      it('Check has dx-form class', () => {
        const form = mount<Form>(<Form {...scrollingEnabled} />);
        expect(form.getDOMNode().classList.contains('dx-form')).toEqual(true);
      });
    });

    describe('aria', () => {
      it('Check has form role', () => {
        const form = mount<Form>(<Form {...scrollingEnabled} />);
        expect(form.getDOMNode().getAttribute('role')).toEqual('form');
      });
    });
  });
});
