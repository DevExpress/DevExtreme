import React from 'react';
import { shallow } from 'enzyme';
import { RadioGroup, RadioGroupProps, viewFunction as RadioGroupView } from '../radio_group';
import { EditorStateProps } from '../internal/editor_state_props';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyRadioGroup from '../../../../ui/radio_group';

jest.mock('../../../../ui/radio_group', () => jest.fn());

describe('RadioGroup', () => {
  it('default render', () => {
    const componentProps = { ...new RadioGroupProps(), ...new EditorStateProps() };
    const props = {
      componentProps,
      restAttributes: { 'rest-attributes': 'true' },
    } as Partial<RadioGroup>;
    const tree = shallow(<RadioGroupView {...props as any} /> as any);

    expect(tree.find(DomComponentWrapper).props()).toMatchObject({
      componentProps,
      componentType: LegacyRadioGroup,
      'rest-attributes': 'true',
    });
  });
});
