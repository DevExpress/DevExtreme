import React from 'react';
import { shallow } from 'enzyme';
import { Popup } from '../../../overlays/popup';
import { Popover } from '../../../overlays/popover';
import {
  SchedulerCalendar as Calendar,
  SchedulerCalendarProps as CalendarProps,
  viewFunction as ViewFunction,
} from '../calendar';

describe('Calendar', () => {
  describe('Render', () => {
    const renderComponent = (viewModel) => shallow(
      <ViewFunction
        {...viewModel}
        props={{
          ...new CalendarProps(),
          ...viewModel.props,
        }}
      />,
    );

    it('should render Popover if desktop layout', () => {
      const tree = renderComponent({ isMobile: false });
      const popover = tree.childAt(0);

      expect(popover.is(Popover)).toBe(true);
    });

    it('should render Popup if mobile layout', () => {
      const tree = renderComponent({ isMobile: true });
      const popup = tree.childAt(0);

      expect(popup.is(Popup)).toBe(true);
    });
  });

  describe('Behaviour', () => {
    describe('Methods', () => {
      describe('updateVisible', () => {
        it('should update prop visible', () => {
          const toolbar = new Calendar({
            ...new CalendarProps(),
            visible: true,
          });

          toolbar.updateVisible(false);

          expect(toolbar.props.visible).toBe(false);
        });
      });

      describe('updateDate', () => {
        it('should update prop currentDate', () => {
          const toolbar = new Calendar({
            ...new CalendarProps(),
            currentDate: new Date(2021, 7, 7),
          });

          toolbar.updateDate(new Date(2021, 8, 8));

          expect(toolbar.props.currentDate.getTime()).toBe(new Date(2021, 8, 8).getTime());
        });
      });
    });

    describe('Callbacks', () => {
      const renderComponent = (viewModel) => shallow(
        <ViewFunction
          {...viewModel}
          props={{
            ...new CalendarProps(),
            ...viewModel.props,
          }}
        />,
      );

      describe('onShown', () => {
        [
          {
            isMobile: false,
            overlayType: 'Popover',
          },
          {
            isMobile: true,
            overlayType: 'Popup',
          },
        ].forEach(({ isMobile, overlayType }) => {
          it(`should focus calendar if container is ${overlayType}`, () => {
            const mockCallback = jest.fn();
            const tree = renderComponent({
              isMobile,
              calendarRef: {
                current: {
                  focus: mockCallback,
                },
              },
            });
            const overlay = tree.childAt(0);
            overlay.prop('onShown')();

            expect(mockCallback).toBeCalledTimes(1);
          });

          it(`should not fail on focusing if calendar is not provided in ${overlayType}`, () => {
            const tree = renderComponent({
              isMobile,
              calendarRef: {},
            });
            const overlay = tree.childAt(0);

            expect(() => overlay.prop('onShown')()).not.toThrow();
          });
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('isMobile', () => {
        it('should return passed prop value', () => {
          const toolbar = new Calendar({
            ...new CalendarProps(),
            isMobileLayout: false,
          });

          expect(toolbar.isMobile).toBe(false);
        });
      });
    });
  });
});
