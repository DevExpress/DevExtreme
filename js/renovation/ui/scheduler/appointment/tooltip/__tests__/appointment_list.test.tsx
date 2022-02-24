import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as ViewFunction } from '../appointment_list';
import { List } from '../../../../list';

describe('Appointment list', () => {
  const defaultViewModel = {
    appointment: {
      startDate: new Date('2021-08-05T10:00:00.000Z'),
      endDate: new Date('2021-08-05T12:00:00.000Z'),
      text: 'Some text',
    },

    geometry: {
      empty: false,
      left: 1,
      top: 2,
      width: 10,
      height: 20,
      leftVirtualWidth: 1,
      topVirtualHeight: 2,
    },

    info: {
      appointment: {
        startDate: new Date('2021-08-05T10:00:00.000Z'),
        endDate: new Date('2021-08-05T12:00:00.000Z'),
      },
      sourceAppointment: {
        groupIndex: 1,
      },
      dateText: '1AM - 2PM',
      resourceColor: '#1A2BC',
    },
  };

  describe('Render', () => {
    const render = (viewModel = {} as any): ShallowWrapper => shallow(
      <ViewFunction
        {...viewModel}
        props={{
          appointments: [defaultViewModel],
          ...viewModel.props,
        }}
      />,
    );

    it('should have correct render', () => {
      const list = render();

      expect(list.type())
        .toBe(List);
    });
  });
});
