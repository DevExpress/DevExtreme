import React from 'react';
import { shallow } from 'enzyme';
import { AppointmentsDataProvider, viewFunction as View } from '../appointments_data_provider';

describe('ConfigProvider', () => {
  it('render', () => {
    const tree = shallow(View({
      props: { children: <div className="child" /> },
    } as any));

    expect(tree.find('.child').exists())
      .toBe(true);
  });

  it('setup config provider value', () => {
    const component = new AppointmentsDataProvider({
      appointmentsData: 'data',
    } as any);

    expect(component.appointmentsData)
      .toEqual({ data: 'data' });
  });
});
