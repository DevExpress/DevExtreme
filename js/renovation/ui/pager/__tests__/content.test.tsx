/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef, forwardRef } from 'react';
import { mount } from 'enzyme';
import { PagerContent, PagerContentProps, viewFunction as PagerContentComponent } from '../content';
import { PageIndexSelector } from '../pages/page_index_selector';
import { PageSizeSelector } from '../page_size/selector';
import { InfoText } from '../info';

jest.mock('../pages/page_index_selector', () => ({ PageIndexSelector: () => null }));
jest.mock('../page_size/selector', () => ({ PageSizeSelector: forwardRef(() => null) }));
jest.mock('../info', () => ({ InfoText: forwardRef(() => null) }));

describe('PagerContent', () => {
  describe('View', () => {
    it('render all children', () => {
      const componentProps = {
        pageSizeChange: jest.fn() as any,
        pageIndexChange: jest.fn() as any,
        infoText: 'infoText',
        hasKnownLastPage: true,
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
      } as PagerContent['props'];
      const props = {
        className: 'className',
        pagesContainerVisible: true,
        isLargeDisplayMode: true,
        infoVisible: true,
        props: componentProps,
        restAttributes: { 'rest-attribute': {} },
      } as Partial<PagerContent> as PagerContent;
      const tree = mount(<PagerContentComponent {...props as any} />).childAt(0);
      expect((tree.instance() as unknown as Element).className).toEqual('className');
      expect(tree.props()).toMatchObject({
        className: 'className',
        'rest-attribute': props.restAttributes['rest-attribute'],
      });
      expect(tree.children()).toHaveLength(2);
      expect(tree.find(PageSizeSelector)).toHaveLength(1);
      expect(tree.childAt(0).props()).toMatchObject({
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
      expect(tree.find(InfoText)).toHaveLength(1);
      expect(pagesContainer.childAt(0).props()).toMatchObject({
        infoText: 'infoText',
        pageCount: 50,
        pageIndex: 2,
        totalCount: 100,
      });
      expect(pagesContainer.childAt(1).props()).toMatchObject({
        isLargeDisplayMode: true,
        hasKnownLastPage: true,
        maxPagesCount: 10,
        pageCount: 50,
        pageIndex: 2,
        pageIndexChange: props.props.pageIndexChange,
        pagesCountText: 'pagesCountText',
        rtlEnabled: true,
        showNavigationButtons: true,
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
        } as PagerContent as any}
      />).childAt(0);
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
      } as PagerContent;
      const tree = mount(<PagerContentComponent {...props as any} />).childAt(0);
      expect(tree.instance()).toBe(parentRef.current);
      expect(tree.childAt(0).instance()).toBe(pageSizesRef.current);
      expect(tree.childAt(1).instance()).toBe(pagesRef.current);
      expect(tree.childAt(1).childAt(0).instance()).toBe(infoTextRef.current);
    });
  });

  describe('Logic', () => {
    describe('pagesContainerVisible', () => {
      it('pagesNavigatorVisible', () => {
        const component = new PagerContent({
          pageCount: 1,
          pagesNavigatorVisible: 'auto',
        } as PagerContentProps);
        expect(component.pagesContainerVisible).toBe(true);
        component.props.pagesNavigatorVisible = false;
        expect(component.pagesContainerVisible).toBe(false);
      });

      it('pageCount', () => {
        const component = new PagerContent({
          pageCount: 0,
          pagesNavigatorVisible: 'auto',
        } as PagerContentProps);
        expect(component.pagesContainerVisible).toBe(false);
        component.props.pageCount = 1;
        expect(component.pagesContainerVisible).toBe(true);
      });
    });

    describe('pagesContainerVisibility', () => {
      it('hidden because pageCount = 1', () => {
        const component = new PagerContent({
          pageCount: 1,
          hasKnownLastPage: true,
          pagesNavigatorVisible: 'auto',
        } as PagerContentProps);
        expect(component.pagesContainerVisibility).toBe('hidden');
      });

      it('visible because pageCount > 1', () => {
        const component = new PagerContent({
          pagesNavigatorVisible: 'auto',
          pageCount: 2,
        } as PagerContentProps);
        expect(component.pagesContainerVisibility).toBeUndefined();
      });

      it('visible because navigatorVisible', () => {
        const component = new PagerContent({
          pagesNavigatorVisible: true,
          pageCount: 1,
        } as PagerContentProps);
        expect(component.pagesContainerVisibility).toBeUndefined();
      });

      it('pagesContainerVisibility, visible because hasKnownLastPage is false', () => {
        const component = new PagerContent({
          hasKnownLastPage: false,
          pagesNavigatorVisible: 'auto',
          pageCount: 1,
        } as PagerContentProps);
        expect(component.pagesContainerVisibility).toBeUndefined();
      });
    });

    describe('className', () => {
      it('customClass', () => {
        const component = new PagerContent({
        } as PagerContentProps);
        expect(component.className).toBe('dx-widget dx-pager dx-state-invisible dx-light-mode');
        component.props.className = 'custom';
        expect(component.className).toEqual(expect.stringContaining('custom'));
      });

      it('isLargeDisplayMode', () => {
        let component = new PagerContent({
          lightModeEnabled: false,
          isLargeDisplayMode: true,
        } as PagerContentProps);
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.className).not.toEqual(expect.stringContaining('dx-light-mode'));

        component = new PagerContent({
          lightModeEnabled: true,
          isLargeDisplayMode: true,
        } as PagerContentProps);
        expect(component.isLargeDisplayMode).toBe(false);
        expect(component.className).toEqual(expect.stringContaining('dx-light-mode'));
      });

      it('visible', () => {
        const component = new PagerContent({
          visible: false,
        } as PagerContentProps);
        expect(component.className).toEqual(expect.stringContaining('dx-state-invisible'));
        component.props.visible = true;
        expect(component.className).not.toEqual(expect.stringContaining('dx-state-invisible'));
      });
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
