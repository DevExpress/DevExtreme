/* eslint-disable jest/expect-expect */
import React from 'react';
import { shallow } from 'enzyme';
import { GridPager, viewFunction as GridPagerComponent } from '../grid_pager';

describe('GridPager', () => {
  describe('View', () => {
    it('render props', () => {
      const props = {
        pageIndex: 3,
        pageIndexChange: jest.fn(),
        props: {},
        restAttributes: { restAttribute: {} },
      } as Partial<GridPager>;
      const tree = shallow(<GridPagerComponent {...props as any} /> as any);
      expect(tree.at(0).props()).toMatchObject({
        pageIndex: 3,
        pageIndexChange: props.pageIndexChange,
        restAttribute: props.restAttributes?.restAttribute,
      });
    });
  });

  describe('Behaviuor', () => {
    it('pageIndex', () => {
      const component = new GridPager({ pageIndex: 4 });
      expect(component.pageIndex).toBe(3);
    });

    it('pageIndexChange', () => {
      const pageIndexChange = jest.fn();
      const component = new GridPager({ });
      component.pageIndexChange(4);
      expect(pageIndexChange).not.toBeCalled();
      component.props.pageIndexChange = pageIndexChange;
      component.pageIndexChange(4);
      expect(pageIndexChange).toBeCalledWith(5);
    });

    it('className', () => {
      const component = new GridPager({ className: 'custom' });
      expect(component.className).toBe('dx-datagrid-pager custom');
    });
  });
});
