/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { mount } from 'enzyme';
import DxSelectBox from '../../../ui/select_box';
import { viewFunction as SelectBoxView, SelectBoxProps, SelectBox } from '../select_box';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/validation_message', () => jest.fn());

describe('Selectbox', () => {
  it('View render', () => {
    const props = {
      props: new SelectBoxProps(),
      restAttributes: { 'rest-attributes': 'true' },
    } as Partial<SelectBox>;
    const tree = mount(<SelectBoxView {...props as any} /> as any);

    expect(tree.find(DomComponentWrapper).props()).toMatchObject({
      componentProps: props.props,
      componentType: DxSelectBox,
      'rest-attributes': 'true',
    });
  });
});
