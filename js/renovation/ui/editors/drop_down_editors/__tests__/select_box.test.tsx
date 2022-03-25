/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import LegacySelectBox from '../../../../../ui/select_box';
import { viewFunction as SelectBoxView, SelectBoxProps, SelectBox } from '../select_box';
import { DomComponentWrapper } from '../../../common/dom_component_wrapper';
import { EditorStateProps } from '../../internal/editor_state_props';

jest.mock('../../../../../ui/select_box', () => jest.fn());

describe('Selectbox', () => {
  it('View render', () => {
    const componentProps = { ...new SelectBoxProps(), ...new EditorStateProps() };
    const props = {
      componentProps,
      restAttributes: { 'rest-attributes': 'true' },
    } as Partial<SelectBox>;
    const tree = shallow(<SelectBoxView {...props as any} /> as any);

    expect(tree.find(DomComponentWrapper).props()).toMatchObject({
      componentProps,
      componentType: LegacySelectBox,
      'rest-attributes': 'true',
    });
  });
});
