import React from 'react';
import { shallow } from 'enzyme';
import { RadioGroup, RadioGroupProps, viewFunction as RadioGroupView } from '../radio_group';
import { EditorStateProps } from '../common/editor_state_props';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyRadioGroup from '../../../../ui/radio_group';
import devices from '../../../../core/devices';

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  const real = actualDevices.real.bind(actualDevices);

  actualDevices.real = jest.fn(real);

  return actualDevices;
});

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

  it('layout prop value for tablet', () => {
    (devices.real as jest.Mock).mockImplementation(() => ({ deviceType: 'tablet' }));

    try {
      const componentProps = { ...new RadioGroupProps() };
      const props = {
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<RadioGroup>;
      const tree = shallow(<RadioGroupView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props().componentProps).toMatchObject({
        layout: 'horizontal',
      });
    } finally {
      jest.resetAllMocks();
    }
  });
});
