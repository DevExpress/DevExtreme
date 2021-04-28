import { mount } from 'enzyme';
import React from 'react';
import each from 'jest-each';
import { FormLayoutManager } from '../form_layout_manager';
import { FormLayoutManagerProps } from '../form_layout_manager_props';
import { isDefined } from '../../../../core/utils/type';
import messageLocalization from '../../../../localization/message';

describe('FormLayoutManager', () => {
  it('InitialProps', () => {
    const props = new FormLayoutManagerProps();
    const form = mount<FormLayoutManager>(<FormLayoutManager {...props} />);

    expect(form.props()).toEqual({
      isRoot: false,
      labelLocation: 'left',
      layoutData: {},
      minColWidth: 200,
      optionalMark: undefined,
      readOnly: false,
      requiredMark: '*',
      requiredMessage: undefined,
      showOptionalMark: false,
      showRequiredMark: true,
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

  describe('localization', () => {
    each([undefined, null, 'test']).describe('optionalMark %o', (optionalMark) => {
      it('Check optionalMark', () => {
        const layoutManager = new FormLayoutManager({ optionalMark });

        const expected = isDefined(optionalMark)
          ? optionalMark
          : messageLocalization.format('dxForm-optionalMark');
        expect(layoutManager.optionalMark).toEqual(expected);
      });
    });

    each([undefined, null, () => 'test']).describe('requiredMessage %o', (requiredMessage) => {
      it('Check requiredMessage', () => {
        const layoutManager = new FormLayoutManager({ requiredMessage });

        const expected = isDefined(requiredMessage)
          ? requiredMessage
          : messageLocalization.getFormatter('dxForm-requiredMessage');

        expect(layoutManager.requiredMessage.toString()).toEqual(expected.toString());
      });
    });
  });
});
