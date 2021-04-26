/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { createTestRef } from '../../test_utils/create_ref';
import LegacyCalendar from '../../../ui/calendar';
import { viewFunction as CalendarView, CalendarProps, Calendar } from '../calendar';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/calendar', () => jest.fn());

describe('Calendar', () => {
  describe('View', () => {
    it('View render', () => {
      const rootElementRef = createTestRef();
      const componentProps = new CalendarProps();
      const props = {
        props: { rootElementRef },
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
    it('componentProps', () => {
      const props = new CalendarProps();
      const calendar = new Calendar({ ...props });

      expect(calendar.componentProps).toMatchObject(props);
    });
  });
});
