/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, createRef } from 'preact';
import { mount } from 'enzyme';
import PageIndexSelector from '../../../js/renovation/pager/page-index-selector';
import PagerContent, { PagerContentProps, viewFunction as PagerContentComponent } from '../../../js/renovation/pager/pager-content';
import PageSizeSelector from '../../../js/renovation/pager/page-size-selector';
import InfoText from '../../../js/renovation/pager/info';

jest.mock('../../../js/renovation/pager/page-size-selector', () => jest.fn());
jest.mock('../../../js/renovation/pager/page-index-selector', () => jest.fn());
jest.mock('../../../js/renovation/pager/info', () => jest.fn());

describe('PagerContent', () => {
  describe('View', () => {
    it('render all children', () => {
      const props = {
        className: 'className',
        pagesContainerVisible: true,
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
      expect(tree.find(PageSizeSelector)).toHaveLength(1);
      expect(tree.childAt(0).props()).toEqual({
        children: [],
        isLargeDisplayMode: true,
        pageSize: 5,
        pageSizeChange: props.props.pageSizeChange,
        pageSizes: [5, 10],
        rtlEnabled: true,
      });
      const pagesContainer = tree.childAt(1);
      expect((pagesContainer.instance() as unknown as Element).className).toEqual('dx-pages');
      expect(pagesContainer.children()).toHaveLength(2);
      expect(tree.find(PageIndexSelector)).toHaveLength(1);
      expect(pagesContainer.childAt(0).props()).toEqual({
        children: [],
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
      expect(tree.find(InfoText)).toHaveLength(1);
      expect(pagesContainer.childAt(1).props()).toEqual({
        children: [],
        infoText: 'infoText',
        pageCount: 50,
        pageIndex: 2,
        totalCount: 100,
      });
    });
    it('pagesContainerVisibility = false', () => {
      const parentRef = createRef();
      const tree = mount(<PagerContentComponent
        {...{
          pagesContainerVisible: true,
          pagesContainerVisibility: 'hidden',
          props: {
            parentRef,
          },
        } as Partial<PagerContent> as any}
      /> as any).childAt(0);
      expect((tree.find('.dx-pages').instance() as unknown as HTMLElement).style).toHaveProperty('visibility', 'hidden');
    });
    it('pagesContainerVisible = false', () => {
      const parentRef = createRef();
      const tree = mount(<PagerContentComponent
        {...{
          pagesContainerVisible: false,
          props: {
            parentRef,
          },
        } as any}
      /> as any).childAt(0);
      expect(tree.find('.dx-pages')).toHaveLength(0);
    });
    it('infoVisible = false', () => {
      const parentRef = createRef();
      const tree = mount(<PagerContentComponent
        {...{
          pagesContainerVisible: true,
          infoVisible: false,
          props: {
            parentRef,
          },
        } as any}
      /> as any).childAt(0);
      const pagesContainer = tree.childAt(0);
      expect(tree.find(InfoText)).toHaveLength(0);
      expect(pagesContainer).toHaveLength(1);
    });
    it('showPageSizes = false', () => {
      const parentRef = createRef();
      const tree = mount(<PagerContentComponent
        {...{
          props: {
            showPageSizes: false,
            parentRef,
          },
        } as any}
      /> as any).childAt(0);
      expect(tree).toHaveLength(1);
      expect(tree.find(PageSizeSelector)).toHaveLength(0);
    });
    it('refs', () => {
      const parentRef = createRef();
      const pageSizesRef = createRef();
      const pagesRef = createRef();
      const infoTextRef = createRef();
      const props = {
        className: 'className',
        pagesContainerVisible: true,
        isLargeDisplayMode: true,
        infoVisible: true,
        props: {
          showPageSizes: true,
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
    it('pagesContainerVisible', () => {
      const component = new PagerContent({
        pageCount: 1,
        pagesNavigatorVisible: 'auto',
      } as PagerContentProps);
      expect(component.pagesContainerVisible).toBe(true);
      component.props.pagesNavigatorVisible = false;
      expect(component.pagesContainerVisible).toBe(false);
    });
    it('pagesContainerVisibility', () => {
      const component = new PagerContent({
        pageCount: 1,
        pagesNavigatorVisible: 'auto',
      } as PagerContentProps);
      expect(component.pagesContainerVisibility).toBe('hidden');
      component.props.pageCount = 2;
      expect(component.pagesContainerVisibility).toBeUndefined();
      component.props.pageCount = 1;
      component.props.pagesNavigatorVisible = true;
      expect(component.pagesContainerVisibility).toBeUndefined();
    });
    it('className', () => {
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
    it('isLargeDisplayMode', () => {
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
    it('infoVisible', () => {
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
