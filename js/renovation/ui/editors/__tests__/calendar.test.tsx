import React from 'react';
import { shallow } from 'enzyme';
import LegacyCalendar from '../../../../ui/calendar';
import { viewFunction as CalendarView, CalendarProps, Calendar } from '../calendar';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';

jest.mock('../../../../ui/calendar', () => jest.fn());

describe('Calendar', () => {
  describe('View', () => {
    it('View render', () => {
      const componentProps = new CalendarProps();
      const props = {
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Calendar>;
      const tree = shallow(<CalendarView {...props as any} />);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyCalendar,
        'rest-attributes': 'true',
      });
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      describe('saveInstance', () => {
        it('should save instance', () => {
          const calendar: any = new Calendar({
            ...new CalendarProps(),
          });
          const instance = {};

          calendar.domComponentWrapperRef = {
            current: {
              getInstance: () => instance,
            },
          };

          calendar.saveInstance();
          expect(calendar.instance).toEqual(instance);
        });

        it('should not fail if ref has no "current"', () => {
          const calendar: any = new Calendar({
            ...new CalendarProps(),
          });
          calendar.domComponentWrapperRef = {};

          expect(() => { calendar.saveInstance(); }).not.toThrow();
        });
      });

      describe('focus', () => {
        it('should set the "focus" event listener to instance', () => {
          const mockCallback = jest.fn();
          const calendar: any = new Calendar({
            ...new CalendarProps(),
          });

          calendar.instance = { focus: mockCallback };

          calendar.focus();
          expect(mockCallback).toBeCalledTimes(1);
        });

        it('should not fail if instance is not set', () => {
          const calendar: any = new Calendar({
            ...new CalendarProps(),
          });

          expect(() => { calendar.focus(); }).not.toThrow();
        });
      });
    });
  });

  describe('Logic', () => {
    it('props defaults', () => {
      const props = new CalendarProps();

      expect(props.skipFocusCheck).toEqual(false);
      // eslint-disable-next-line no-underscore-dangle
      expect(props._todayDate?.() instanceof Date).toEqual(true);
    });
  });
});
