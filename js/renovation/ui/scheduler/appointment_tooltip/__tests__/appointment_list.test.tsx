import React from 'react';
import { mount } from 'enzyme';
import {
  AppointmentList,
  viewFunction as AppointmentListView,
} from '../appointment_list';
import { List } from '../../../list';
import { TooltipItemLayout } from '../item_layout';
import getCurrentAppointment from '../utils/get_current_appointment';

jest.mock('../item_layout', () => ({
  __esModule: true,
  TooltipItemLayout: () => null,
}));

jest.mock('../../../list', () => ({
  __esModule: true,
  List: (props) => {
    // eslint-disable-next-line react/prop-types
    const { dataSource } = props;
    return (
      <props.itemTemplate
        item={dataSource[0]}
        index={0}
        container="container"
      />
    );
  },
}));

jest.mock('../utils/get_current_appointment', () => jest.fn(() => ({
  text: 'currentAppointment',
})));

describe('AppointmentList', () => {
  describe('Render', () => {
    const appointments = [{
      data: { text: 'data1' },
      currentData: { text: 'currentData1' },
    }, {
      data: { text: 'data2' },
      currentData: { text: 'currentData2' },
    }];
    const getSingleAppointmentData = jest.fn();

    const render = ({ props, ...restProps }) => mount(AppointmentListView({
      props: {
        getSingleAppointmentData,
        appointments,
        isEditingAllowed: true,
        ...props,
      },
      ...restProps,
    } as any) as any);

    beforeAll(() => {
      getSingleAppointmentData.mockImplementation(() => ({
        text: 'singleAppointment',
      }));
    });

    it('should render List with correct props', () => {
      const renderProps = {
        itemContentTemplate: jest.fn(),
        focusStateEnabled: true,
      };
      const restAttributes = { 'custom-attribute': 'customAttribute' };
      const onItemClick = jest.fn();

      const appointmentList = render({
        props: renderProps,
        onItemClick,
        restAttributes,
      });

      expect(appointmentList.type())
        .toBe(List);
      expect(appointmentList.props())
        .toMatchObject({
          ...restAttributes,
          onItemClick,
          dataSource: appointments,
          focusStateEnabled: renderProps.focusStateEnabled,
          itemTemplate: expect.any(Function),
        });
    });

    it('should pass correct props to TooltipItemLayout', () => {
      const renderProps = {
        checkAndDeleteAppointment: jest.fn,
        onHide: jest.fn(),
        itemContentTemplate: (): null => null,
        getTextAndFormatDate: jest.fn(),
        target: 'target',
      };
      const appointmentList = render({
        props: {
          ...renderProps,
        },
      });

      const tooltipItemLayout = appointmentList.find(TooltipItemLayout);

      expect(tooltipItemLayout.exists())
        .toBe(true);
      expect(tooltipItemLayout.props())
        .toMatchObject({
          item: appointments[0],
          index: 0,
          onDelete: renderProps.checkAndDeleteAppointment,
          onHide: renderProps.onHide,
          itemContentTemplate: renderProps.itemContentTemplate,
          getTextAndFormatDate: renderProps.getTextAndFormatDate,
          singleAppointment: { text: 'singleAppointment' },
          showDeleteButton: true,
        });
      expect(getSingleAppointmentData)
        .toHaveBeenCalledWith(appointments[0].data, renderProps.target);
    });

    it('should pass `showDeleteButton` = false to TooltipItemLayout if appointment is disabled', () => {
      const renderProps = {
        appointments: [{
          data: { text: 'data1', disabled: true },
          currentData: { text: 'currentData1' },
        }],
      };
      const appointmentList = render({
        props: {
          ...renderProps,
        },
      });

      const tooltipItemLayout = appointmentList.find(TooltipItemLayout);

      expect(tooltipItemLayout.prop('showDeleteButton'))
        .toBe(false);
    });

    it('should pass `showDeleteButton` = false to TooltipItemLayout if `isEditingAllowed` = false', () => {
      const renderProps = {
        appointments: [{
          data: { text: 'data1', disabled: false },
          currentData: { text: 'currentData1' },
        }],
        isEditingAllowed: false,
      };
      const appointmentList = render({
        props: {
          ...renderProps,
        },
      });

      const tooltipItemLayout = appointmentList.find(TooltipItemLayout);

      expect(tooltipItemLayout.prop('showDeleteButton'))
        .toBe(false);
    });

    it('should pass `showDeleteButton` = false to TooltipItemLayout if `isEditingAllowed` = false and data is disabled', () => {
      const renderProps = {
        appointments: [{
          data: { text: 'data1', disabled: true },
          currentData: { text: 'currentData1' },
        }],
        isEditingAllowed: false,
      };
      const appointmentList = render({
        props: {
          ...renderProps,
        },
      });

      const tooltipItemLayout = appointmentList.find(TooltipItemLayout);

      expect(tooltipItemLayout.prop('showDeleteButton'))
        .toBe(false);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('onItemClick', () => {
        it('should create onItemClick correctly', () => {
          const showAppointmentPopup = jest.fn();
          const appointmentList = new AppointmentList({ showAppointmentPopup });

          const { onItemClick } = appointmentList;
          expect(onItemClick)
            .toEqual(expect.any(Function));

          const itemData = { data: { text: 'appointment' } };
          onItemClick({ itemData });

          expect(getCurrentAppointment)
            .toHaveBeenCalledWith(itemData);
          expect(showAppointmentPopup)
            .toHaveBeenCalledTimes(1);
          expect(showAppointmentPopup)
            .toHaveBeenCalledWith(itemData.data, false, { text: 'currentAppointment' });
        });

        it('should create onItemClick when showAppointmentPopup is undefined', () => {
          const appointmentList = new AppointmentList({});

          const { onItemClick } = appointmentList;
          expect(onItemClick)
            .toEqual(expect.any(Function));

          const itemData = { data: { text: 'appointment' } };

          expect(() => onItemClick({ itemData }))
            .not.toThrow();
        });
      });
    });
  });
});
