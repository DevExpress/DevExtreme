/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, createRef } from 'preact';
import { mount } from 'enzyme';
import PagerContent, { PagerContentProps, viewFunction as PagerContentComponent } from '../../../js/renovation/pager/pager-content';

jest.mock('../../../js/renovation/select-box', jest.fn());
jest.mock('../../../js/renovation/pager/page-size-selector', jest.fn());
jest.mock('../../../js/renovation/pager/page-index-selector', jest.fn());
jest.mock('../../../js/renovation/pager/info', jest.fn());


describe('PagerContent', () => {
  describe('View', () => {
    it('render', () => {
      const props = {
        className: 'className',
        isLargeDisplayMode: true,
        infoVisible: true,
        props: {
          pageSizeChange: jest.fn() as any,
          pageIndexChange: jest.fn() as any,
          infoText: 'infoText',
          maxPagesCount: 10,
          pageIndex: 2,
          pageCount: 50,
          showPageSizes: true,
          pageSize: 5,
          pageSizes: [5, 10],
          pagesCountText: 'pagesCountText',
          rtlEnabled: true,
          showNavigationButtons: true,
          totalCount: 100,
        },
      } as Partial<PagerContent> as PagerContent;
      const tree = mount(<PagerContentComponent {...props as any} /> as any).childAt(0);
      expect((tree.instance() as unknown as Element).className).toEqual('className');
      expect(tree.children()).toHaveLength(2);
      expect(tree.childAt(0).props()).toEqual({
        isLargeDisplayMode: true,
        pageSize: 5,
        pageSizeChange: props.props.pageSizeChange,
        pageSizes: [5, 10],
        rtlEnabled: true,
        visible: true,
      });
      const pagesContainer = tree.childAt(1);
      expect((pagesContainer.instance() as unknown as Element).className).toEqual('dx-pages');
      expect(pagesContainer.children()).toHaveLength(2);
      expect(pagesContainer.childAt(0).props()).toEqual({
        isLargeDisplayMode: true,
        maxPagesCount: 10,
        pageCount: 50,
        pageIndex: 2,
        pageIndexChange: props.props.pageIndexChange,
        pagesCountText: 'pagesCountText',
        rtlEnabled: true,
        showNavigationButtons: true,
        totalCount: 100,
      });
      expect(pagesContainer.childAt(1).props()).toEqual({
        infoText: 'infoText',
        pageCount: 50,
        pageIndex: 2,
        totalCount: 100,
        visible: true,
      });
    });
    it('refs', () => {
      const parentRef = createRef();
      const pageSizesRef = createRef();
      const pagesRef = createRef();
      const infoTextRef = createRef();
      const props = {
        className: 'className',
        isLargeDisplayMode: true,
        infoVisible: true,
        props: {
          parentRef,
          pageSizesRef,
          pagesRef,
          infoTextRef,
        },
      };
      const tree = mount(<PagerContentComponent {...props as any} /> as any).childAt(0);
      expect(tree.instance()).toBe(parentRef.current);
      expect(tree.childAt(0).instance()).toBe(pageSizesRef.current);
      expect(tree.childAt(1).instance()).toBe(pagesRef.current);
      expect(tree.childAt(1).childAt(1).instance()).toBe(infoTextRef.current);
    });
  });
  describe('Logic', () => {
    it('Logic, className', () => {
      let component = new PagerContent({
        lightModeEnabled: false,
        isLargeDisplayMode: true,
      } as PagerContentProps);
      expect(component.isLargeDisplayMode).toBe(true);
      expect(component.className.indexOf('dx-light-mode')).toBe(-1);

      component = new PagerContent({
        lightModeEnabled: true,
        isLargeDisplayMode: true,
      } as PagerContentProps);
      expect(component.isLargeDisplayMode).toBe(false);
      expect(component.className.indexOf('dx-light-mode')).not.toBe(-1);
    });
    it('Logic isLargeDisplayMode', () => {
      let component = new PagerContent({
        lightModeEnabled: false,
        isLargeDisplayMode: true,
      } as PagerContentProps);
      expect(component.isLargeDisplayMode).toBe(true);

      component = new PagerContent({
        lightModeEnabled: true,
        isLargeDisplayMode: true,
      } as PagerContentProps);
      expect(component.isLargeDisplayMode).toBe(false);

      component = new PagerContent({
        lightModeEnabled: false,
        isLargeDisplayMode: false,
      } as PagerContentProps);
      expect(component.isLargeDisplayMode).toBe(false);

      component = new PagerContent({
        lightModeEnabled: true,
        isLargeDisplayMode: false,
      } as PagerContentProps);
      expect(component.isLargeDisplayMode).toBe(false);
    });
    it('Logic infoVisible', () => {
      let component = new PagerContent({
        showInfo: true,
        infoTextVisible: true,
      } as PagerContentProps);
      expect(component.infoVisible).toBe(true);
      component = new PagerContent({
        showInfo: false,
        infoTextVisible: true,
      } as PagerContentProps);
      expect(component.infoVisible).toBe(false);
      component = new PagerContent({
        showInfo: true,
        infoTextVisible: false,
      } as PagerContentProps);
      expect(component.infoVisible).toBe(false);
      component = new PagerContent({
        showInfo: false,
        infoTextVisible: false,
      } as PagerContentProps);
      expect(component.infoVisible).toBe(false);
    });
  });
});
