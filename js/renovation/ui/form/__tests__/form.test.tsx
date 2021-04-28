import { mount } from 'enzyme';
import React from 'react';
import each from 'jest-each';
import { FormProps } from '../form_props';
import { Form } from '../form';
import { Scrollable } from '../../scroll_view/scrollable';
import { defaultScreenFactorFunc } from '../form_utils';
import { isDefined } from '../../../../core/utils/type';
import messageLocalization from '../../../../localization/message';

it('Form > InitialProps', () => {
  const props = new FormProps();
  const form = mount<Form>(<Form {...props} />);

  expect(form.props()).toEqual({
    alignItemLabels: true,
    alignItemLabelsInAllGroups: true,
    alignRootItemLabels: true,
    colCount: 1,
    colCountByScreen: undefined,
    customizeItem: null,
    formData: {},
    items: undefined,
    labelLocation: 'left',
    minColWidth: 200,
    onEditorEnterKey: null,
    onFieldDataChanged: null,
    optionalMark: undefined,
    readOnly: false,
    requiredMark: '*',
    requiredMessage: undefined,
    screenByWidth: defaultScreenFactorFunc,
    scrollingEnabled: false,
    showColonAfterLabel: true,
    showOptionalMark: false,
    showRequiredMark: true,
    showValidationSummary: true,
    stylingMode: undefined,
    validationGroup: undefined,
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
        aria: { role: 'form' },
        bounceEnabled: false,
        classes: 'dx-form',
        direction: 'both',
        useKeyboard: false,
        useNative: !!useNativeScrolling,
        useSimulatedScrollbar: !useNativeScrolling,
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

describe('Form > Getters', () => {
  describe('localization', () => {
    each([undefined, null, 'test']).describe('optionalMark %o', (optionalMark) => {
      it('Check optionalMark', () => {
        const form = new Form({ optionalMark });

        const expected = isDefined(optionalMark)
          ? optionalMark
          : messageLocalization.format('dxForm-optionalMark');
        expect(form.optionalMark).toEqual(expected);
      });
    });

    each([undefined, null, () => 'test']).describe('requiredMessage %o', (requiredMessage) => {
      it('Check requiredMessage', () => {
        const form = new Form({ requiredMessage });

        const expected = isDefined(requiredMessage)
          ? requiredMessage
          : messageLocalization.getFormatter('dxForm-requiredMessage');

        expect(form.requiredMessage.toString()).toEqual(expected.toString());
      });
    });
  });
});
