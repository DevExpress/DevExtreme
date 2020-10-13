/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import LegacyList from '../../../ui/list';
import { viewFunction as ListView, ListProps, List } from '../list';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/list', () => jest.fn());

describe('List', () => {
  describe('View', () => {
    it('default render', () => {
      const rootElementRef = { } as HTMLDivElement;
      const componentProps = new ListProps();
      const props = {
        props: { ...componentProps, rootElementRef },
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<List>;
      const tree = shallow(<ListView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        rootElementRef: {},
        componentProps,
        componentType: LegacyList,
        'rest-attributes': 'true',
      });
    });
  });
});
