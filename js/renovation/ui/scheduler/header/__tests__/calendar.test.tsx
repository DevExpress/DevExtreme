import React from 'react';
import { shallow } from 'enzyme';
import { Popup, PopupProps } from '../../../overlays/popup';
import { Popover, PopoverProps } from '../../../overlays/popover';
import {
  SchedulerCalendar,
  SchedulerCalendarProps as CalendarProps,
  viewFunction as ViewFunction,
} from '../calendar';

describe('Calendar', () => {
  const renderComponent = (viewModel) => shallow(
    <ViewFunction
      {...viewModel}
      props={{
        ...new CalendarProps(),
        ...viewModel.props,
      }}
    />,
  );

  describe('Render', () => {
    it('should render Popover if desktop layout', () => {
      const popover = renderComponent({ isMobile: false });

      expect(popover.is(Popover)).toBe(true);
    });

    it('should pass correct props to Popover', () => {
      const props = {
        visible: true,
      };
      const focusCalendar = () => { };
      const updateVisible = () => { };

      const popover = renderComponent({
        isMobile: false,
        props,
        updateVisible,
        focusCalendar,
      });

      expect(popover.props()).toEqual({
        ...new PopoverProps(),
        target: '.dx-scheduler-navigator-caption',
        className: 'dx-scheduler-navigator-calendar-popover',
        showTitle: false,
        hideOnOutsideClick: true,
        visible: props.visible,
        visibleChange: updateVisible,
        onShown: focusCalendar,
        children: expect.anything(),
      });
    });

    it('should render Popup if mobile layout', () => {
      const popup = renderComponent({ isMobile: true });

      expect(popup.is(Popup)).toBe(true);
    });

    it('should pass correct props to Popup', () => {
      const props = {
        visible: true,
      };
      const focusCalendar = () => { };
      const updateVisible = () => { };

      const popup = renderComponent({
        isMobile: true,
        props,
        focusCalendar,
        updateVisible,
      });

      expect(popup.props()).toEqual({
        ...new PopupProps(),
        className: 'dx-scheduler-navigator-calendar-popup',
        showTitle: false,
        hideOnOutsideClick: true,
        visible: props.visible,
        visibleChange: updateVisible,
        showCloseButton: true,
        fullScreen: true,
        toolbarItems: [{ shortcut: 'cancel' }],
        onShown: focusCalendar,
        children: expect.anything(),
      });
    });

    it('should render overlay child with correct className', () => {
      const overlay = renderComponent({});
      const child = overlay.childAt(0);

      expect(child.prop('className')).toBe('dx-scheduler-navigator-calendar');
    });

    it('should render Calendar with correct props', () => {
      const props = {
        firstDayOfWeek: 2,
        min: new Date(2021, 6, 6),
        max: new Date(2021, 8, 6),
        currentDate: new Date(2021, 7, 7),
      };
      const updateDate = () => { };

      const overlay = renderComponent({ props, updateDate });
      const calendar = overlay.childAt(0).childAt(0);

      expect(calendar.props()).toEqual({
        min: props.min,
        max: props.max,
        firstDayOfWeek: props.firstDayOfWeek,
        value: props.currentDate,
        valueChange: updateDate,
        focusStateEnabled: true,
        skipFocusCheck: true,
        width: '100%',
      });
    });
  });

  describe('Behaviour', () => {
    describe('Methods', () => {
      describe('updateVisible', () => {
        it('should update prop visible', () => {
          const mockCallback = jest.fn();
          const schedulerCalendar = new SchedulerCalendar({
            ...new CalendarProps(),
            onVisibleUpdate: mockCallback,
          });

          schedulerCalendar.updateVisible(false);

          expect(mockCallback).toBeCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith(false);
        });
      });

      describe('updateDate', () => {
        it('should update prop currentDate', () => {
          const mockCallback = jest.fn();
          const schedulerCalendar = new SchedulerCalendar({
            ...new CalendarProps(),
            onCurrentDateUpdate: mockCallback,
          });

          schedulerCalendar.updateDate(new Date(2021, 8, 8));

          expect(mockCallback).toBeCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith(new Date(2021, 8, 8));
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('isMobile', () => {
        it('should return passed prop value', () => {
          const schedulerCalendar = new SchedulerCalendar({
            ...new CalendarProps(),
            isMobileLayout: false,
          });

          expect(schedulerCalendar.isMobile).toBe(false);
        });
      });
    });

    describe('focusCalendar', () => {
      it('should focus calendar', () => {
        const mockCallback = jest.fn();
        const schedulerCalendar = new SchedulerCalendar({
          ...new CalendarProps(),
        });
        schedulerCalendar.calendarRef = {
          current: {
            focus: mockCallback,
          },
        } as any;

        schedulerCalendar.focusCalendar();

        expect(mockCallback).toBeCalledTimes(1);
      });

      it('should not fail if calendar is not provided', () => {
        const schedulerCalendar = new SchedulerCalendar({
          ...new CalendarProps(),
        });
        schedulerCalendar.calendarRef = {} as any;

        expect(() => schedulerCalendar.focusCalendar()).not.toThrow();
      });
    });
  });
});
