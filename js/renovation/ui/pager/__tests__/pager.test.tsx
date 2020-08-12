/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { mount } from 'enzyme';
import { PagerContentComponent } from '../content';
import { Pager as PagerComponent } from '../pager';
import { PageSizeLarge } from '../page_size/large';
import { PageIndexSelector } from '../pages/page_index_selector';

jest.mock('../../select_box', () => ({ __esModule: true, SelectBox: jest.fn() }));

describe('Pager', () => {
  describe('View', () => {
    it('render pager with defaults', () => {
      const tree = mount<PagerComponent>(<PagerComponent />);
      const pager = tree.childAt(0);
      expect(pager.props()).toEqual({
        'rest-attributes': 'restAttributes',
        pagesNavigatorVisible: 'auto',
        visible: true,
        contentTemplate: PagerContentComponent,
        pageIndexChange: tree.instance().pageIndexChange,
        pageSizeChange: tree.instance().pageSizeChange,
        hasKnownLastPage: true,
        infoText: 'Page {0} of {1} ({2} items)',
        lightModeEnabled: false,
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 0,
        pageSize: 5,
        pageSizes: [5, 10],
        pagesCountText: 'of',
        rtlEnabled: false,
        showInfo: false,
        showPageSizes: true,
        showNavigationButtons: false,
        totalCount: 0,
      });
      expect(tree.find(PagerContentComponent)).not.toBeNull();
      expect(tree.find(PageSizeLarge).props().pageSizeChange)
        .toEqual(tree.instance().pageSizeChange);
      expect(tree.find(PageIndexSelector).props().pageIndexChange)
        .toEqual(tree.instance().pageIndexChange);
    });
  });

  describe('Behaviour', () => {
    it('pageSizeChange', () => {
      const component = new PagerComponent({ pageSize: 5 });
      expect(component.props.pageSize).toBe(5);
      component.pageSizeChange(10);
      expect(component.props.pageSize).toBe(10);
    });

    it('pageIndexChange', () => {
      const component = new PagerComponent({ pageIndex: 5 });
      expect(component.props.pageIndex).toBe(5);
      component.pageIndexChange(10);
      expect(component.props.pageIndex).toBe(10);
    });
  });
});
