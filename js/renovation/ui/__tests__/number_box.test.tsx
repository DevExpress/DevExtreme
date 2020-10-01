import React from 'react';
import { mount } from 'enzyme';
import { NumberBox, NumberBoxProps, viewFunction as NumberBoxView } from '../number_box';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import LegacyNumberBox from '../../../ui/number_box';

jest.mock('../../../ui/number_box', () => jest.fn());

describe('NumberBox', () => {
  describe('View', () => {
    it('default render', () => {
      const rootElementRef = {} as HTMLDivElement;
      const props = {
        rootElementRef,
        props: new NumberBoxProps(),
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<NumberBox>;
      const tree = mount(<NumberBoxView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        rootElementRef,
        componentProps: props.props,
        componentType: LegacyNumberBox,
        'rest-attributes': 'true',
      });
    });
  });

  describe('Logic', () => {
    it('getHtmlElement', () => {
      const rootElementRef = {} as HTMLDivElement;
      const component = new NumberBox({});
      component.rootElementRef = rootElementRef;

      expect(component.getHtmlElement()).toEqual(rootElementRef);
    });
  });
});
