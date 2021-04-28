/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { createTestRef } from '../../test_utils/create_ref';
import LegacyCalendar from '../../../ui/calendar';
import { viewFunction as CalendarView, CalendarProps, Calendar } from '../calendar';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/calendar', () => jest.fn());

const defaultProps = {
  _todayDate: () => new Date(),
  hasFocus: () => true,
};

describe('Calendar', () => {
  describe('View', () => {
    it('View render', () => {
      const rootElementRef = createTestRef();
      const componentProps = new CalendarProps();
      const props = {
        props: { rootElementRef, ...defaultProps },
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Calendar>;
      const tree = shallow(<CalendarView {...props as any} />);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        rootElementRef: {},
        componentProps,
        componentType: LegacyCalendar,
        'rest-attributes': 'true',
      });
    });
  });

  describe('Logic', () => {
    it('props defaults', () => {
      const props = new CalendarProps();

      expect(props.hasFocus({} as any)).toEqual(true);
      // eslint-disable-next-line no-underscore-dangle
      expect(props._todayDate() instanceof Date).toEqual(true);
    });

    it('componentProps', () => {
      const props = new CalendarProps();
      const calendar = new Calendar({ ...props });

      expect(calendar.componentProps).toMatchObject(props);
    });
  });
});
