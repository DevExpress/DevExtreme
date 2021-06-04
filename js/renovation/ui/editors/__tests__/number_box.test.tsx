import React from 'react';
import { shallow } from 'enzyme';
import { NumberBox, NumberBoxProps, viewFunction as NumberBoxView } from '../number_box';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyNumberBox from '../../../../ui/number_box';

jest.mock('../../../ui/number_box', () => jest.fn());

describe('NumberBox', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new NumberBoxProps();
      const props = {
        props: componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<NumberBox>;
      const tree = shallow(<NumberBoxView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyNumberBox,
        'rest-attributes': 'true',
      });
    });
  });
});
