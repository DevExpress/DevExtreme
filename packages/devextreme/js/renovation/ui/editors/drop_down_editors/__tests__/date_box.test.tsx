import React from 'react';
import { shallow } from 'enzyme';
import LegacyDateBox from '../../../../../ui/date_box';
import { viewFunction as DateBoxView, DateBoxProps, DateBox } from '../date_box';
import { DomComponentWrapper } from '../../../common/dom_component_wrapper';
import { EditorStateProps } from '../../common/editor_state_props';
import { EditorLabelProps } from '../../common/editor_label_props';

jest.mock('../../../../../ui/date_box', () => jest.fn());

describe('DateBox', () => {
  describe('View', () => {
    it('View render', () => {
      const componentProps = {
        ...new DateBoxProps(),
        ...new EditorStateProps(),
        ...new EditorLabelProps(),
      };
      const props = {
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<DateBox>;
      const tree = shallow(<DateBoxView {...props as any} />);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyDateBox,
        'rest-attributes': 'true',
      });
    });
  });
});
