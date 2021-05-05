import React from 'react';
import { shallow } from 'enzyme';
import { createTestRef } from '../../test_utils/create_ref';
import LegacyDateBox from '../../../ui/date_box';
import { viewFunction as DateBoxView, DateBoxProps, DateBox } from '../date_box';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/date_box', () => jest.fn());

describe('DateBox', () => {
  describe('View', () => {
    it('View render', () => {
      const rootElementRef = createTestRef();
      const componentProps = new DateBoxProps();
      const props = {
        props: { rootElementRef, addWidgetClass: true },
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<DateBox>;
      const tree = shallow(<DateBoxView {...props as any} />);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        rootElementRef: {},
        componentProps,
        componentType: LegacyDateBox,
        'rest-attributes': 'true',
      });
    });
  });

  describe('Logic', () => {
    it('componentProps', () => {
      const props = new DateBoxProps();
      const dateBox = new DateBox({ ...props });

      expect(dateBox.componentProps).toMatchObject(props);
    });
  });
});
