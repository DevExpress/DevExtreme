/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { mount } from 'enzyme';
import { PagerContent } from '../content';
import { Pager as PagerComponent } from '../pager';
import { PageSizeLarge } from '../page_size/large';
import { PageIndexSelector } from '../pages/page_index_selector';
import PagerProps from '../common/pager_props';

jest.mock('../../select_box', () => ({ SelectBox: jest.fn() }));

describe('Pager', () => {
  describe('View', () => {
    it('render pager with defaults', () => {
      const props = new PagerProps();
      const tree = mount<PagerComponent>(<PagerComponent {...props} />);
      const pager = tree.childAt(0);
      const {
        pagerProps: {
          pageIndexChange,
          pageSizeChange,
          ...restPagerProps
        },
        ...restProps
      } = pager.props();

      expect(restProps).toEqual({
        'rest-attributes': 'restAttributes',
        contentTemplate: PagerContent,
      });

      expect(restPagerProps).toEqual({
        gridCompatibility: true,
        className: 'dx-datagrid-pager',
        pagesNavigatorVisible: 'auto',
        visible: true,
        hasKnownLastPage: true,
        lightModeEnabled: undefined,
        displayMode: 'adaptive',
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 0,
        pageSize: 5,
        pageSizes: [5, 10],
        showInfo: false,
        showPageSizes: true,
        showNavigationButtons: false,
        totalCount: 0,
      });

      expect(typeof pageIndexChange).toBe('function');
      expect(typeof pageSizeChange).toBe('function');

      expect(tree.find(PagerContent)).not.toBeNull();
      expect(tree.find(PageSizeLarge).props().pageSizeChange)
        .toEqual(pageSizeChange);
      expect(tree.find(PageIndexSelector).props().pageIndexChange)
        .toEqual(pageIndexChange);
    });
  });

  describe('Behaviour', () => {
    it('pageSizeChange', () => {
      const component = new PagerComponent({ pageSize: 5, gridCompatibility: false });
      expect(component.props.pageSize).toBe(5);
      component.pageSizeChange(10);
      expect(component.props.pageSize).toBe(10);
    });

    it('pageIndexChange', () => {
      const component = new PagerComponent({ pageIndex: 5, gridCompatibility: false });
      expect(component.props.pageIndex).toBe(5);
      component.pageIndexChange(10);
      expect(component.props.pageIndex).toBe(10);
    });

    it('className', () => {
      const component = new PagerComponent({ className: 'custom', gridCompatibility: false });
      expect(component.className).toBe('custom');
    });

    it('pagerProps', () => {
      const component = new PagerComponent({ pageIndex: 0, gridCompatibility: false });

      const { pageIndexChange, pageSizeChange, ...restProps } = component.pagerProps;
      expect(restProps).toMatchObject({
        className: undefined,
        pageIndex: 0,
      });

      pageIndexChange?.(1);
      expect(component.props.pageIndex).toBe(1);
      pageSizeChange?.(10);
      expect(component.props.pageSize).toBe(10);
    });

    describe('gridCompatibility', () => {
      it('pageIndex', () => {
        const component = new PagerComponent({ pageIndex: 4, gridCompatibility: true });
        expect(component.pageIndex).toBe(3);
      });

      it('pageIndexChange', () => {
        const component = new PagerComponent({ gridCompatibility: true });
        component.pageIndexChange(4);
        expect(component.props.pageIndex).toBe(5);
      });

      it('className', () => {
        const component = new PagerComponent({ className: 'custom', gridCompatibility: true });
        expect(component.className).toBe('dx-datagrid-pager custom');
      });
    });
  });
});
