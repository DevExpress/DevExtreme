import React from 'react';
import { shallow } from 'enzyme';
import { AppointmentsDataProvider, viewFunction as View } from '../appointments_data_provider';

describe('ConfigProvider', () => {
  it('should render children', () => {
    const tree = shallow(View({
      props: { children: <div className="child" /> },
    } as any));

    expect(tree.find('.child').exists())
      .toBe(true);
  });

  it('should return correct correct context data', () => {
    const component = new AppointmentsDataProvider({
      appointmentsContextValue: 'data',
    } as any);

    expect(component.appointmentsContextValue)
      .toBe('data');
  });
});
