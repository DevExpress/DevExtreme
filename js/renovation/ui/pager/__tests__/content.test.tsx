/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef, forwardRef } from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import { PagerContent, PagerContentProps, viewFunction as PagerContentComponent } from '../content';
import { PageIndexSelector } from '../pages/page_index_selector';
import { PageSizeSelector } from '../page_size/selector';
import { InfoText } from '../info';
import { Widget } from '../../common/widget';
import { registerKeyboardAction } from '../../../../ui/shared/accessibility';

jest.mock('../../../../ui/shared/accessibility', () => ({ registerKeyboardAction: jest.fn() }));
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
        pagesContainerVisible: true,
        isLargeDisplayMode: true,
        infoVisible: true,
        props: componentProps,
        restAttributes: { 'rest-attribute': {}, className: 'className' },
      } as Partial<PagerContent> as PagerContent;
      const tree = mount(<PagerContentComponent {...props as any} />);
      const widget = tree.childAt(0);
      expect(widget.props()).toMatchObject({
        rtlEnabled: true,
        className: 'className',
        visible: true,
        'rest-attribute': props.restAttributes['rest-attribute'],
      });
      expect(tree.find(Widget).instance()).toBe(widget.instance());
      const childContainer = widget.find('div').first();
      expect(childContainer.children()).toHaveLength(2);
      expect(widget.find(PageSizeSelector)).toHaveLength(1);
      expect(childContainer.childAt(0).props()).toMatchObject({
        isLargeDisplayMode: true,
        pageSize: 5,
        pageSizeChange: props.props.pageSizeChange,
        pageSizes: [5, 10],
        // rtlEnabled: true,
      });
      const pagesContainer = childContainer.childAt(1);
      expect((pagesContainer.instance() as unknown as Element).className).toEqual('dx-pages');
      expect(pagesContainer.children()).toHaveLength(2);
      expect(widget.find(PageIndexSelector)).toHaveLength(1);
      expect(widget.find(InfoText)).toHaveLength(1);
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
        // rtlEnabled: true,
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
      const widgetRef = createRef();
      const pageSizesRef = createRef();
      const pagesRef = createRef();
      const infoTextRef = createRef();
      const props = {
        pagesContainerVisible: true,
        isLargeDisplayMode: true,
        infoVisible: true,
        widgetRef,
        props: {
          rtlEnabled: false,
          showPageSizes: true,
          pageSizesRef,
          pagesRef,
          infoTextRef,
        },
      } as PagerContent;
      const tree = mount(<PagerContentComponent {...props as any} />).childAt(0);
      expect(tree.instance()).toBe(widgetRef.current);
      const childrenContainer = tree.find('div').first();
      expect(childrenContainer.childAt(0).instance()).toBe(pageSizesRef.current);
      expect(childrenContainer.childAt(1).instance()).toBe(pagesRef.current);
      expect(childrenContainer.childAt(1).childAt(0).instance()).toBe(infoTextRef.current);
    });
  });

  describe('Logic', () => {
    it('setParentRef', () => {
      const props = {
        parentRef: {},
      } as PagerContentProps;
      const component = new PagerContent(props);
      component.widgetRef = {} as HTMLElement;
      component.setParentRef();
      expect(component.props.parentRef).toBe(component.widgetRef);
    });

    it('keyboardAction provider', () => {
      const parentElement = { el: 1 };
      const widgetRef = { getHtmlElement: () => parentElement };
      const element = {} as HTMLElement;
      const action = jest.fn();
      const component = new PagerContent({
        pageCount: 1,
        pagesNavigatorVisible: 'auto',
      } as PagerContentProps);
      component.widgetRef = widgetRef;
      component.keyboardAction.registerKeyboardAction(element, action);
      expect(registerKeyboardAction).toBeCalledWith(
        'pager',
        {
          option: expect.any(Function),
          element: expect.any(Function),
          _createActionByOption: expect.any(Function),
        },
        element,
        undefined,
        action,
      );
      const fakeComponent = (registerKeyboardAction as jest.Mock).mock.calls[0][1];
      expect(fakeComponent.element()).toBe(parentElement);
    });

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
      it('isLargeDisplayMode', () => {
        let component = new PagerContent({
          displayMode: 'full',
          isLargeDisplayMode: true,
        } as PagerContentProps);
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.classes).not.toEqual(expect.stringContaining('dx-light-mode'));

        component = new PagerContent({
          displayMode: 'compact',
          isLargeDisplayMode: true,
        } as PagerContentProps);
        expect(component.isLargeDisplayMode).toBe(false);
        expect(component.classes).toEqual(expect.stringContaining('dx-light-mode'));
      });
    });

    each`
         displayMode   | lightModeEnabled| isLargeDisplayMode| expected
         ${'adaptive'} | ${undefined}    | ${true}           | ${true}
         ${'adaptive'} | ${undefined}    | ${false}          | ${false}
         ${'adaptive'} | ${true}         | ${false}          | ${false}
         ${'adaptive'} | ${false}        | ${true}           | ${true}
         ${'compact'}  | ${false}        | ${true}           | ${false}
         ${'full'}     | ${false}        | ${false}          | ${true}
    `
      .describe('isLargeDisplayMode', ({
        displayMode, lightModeEnabled, isLargeDisplayMode, expected,
      }) => {
        const name = JSON.stringify({
          displayMode, lightModeEnabled, isLargeDisplayMode, expected,
        });

        it(name, () => {
          const component = new PagerContent({
            displayMode,
            lightModeEnabled,
            isLargeDisplayMode,
          } as PagerContentProps);
          expect(component.isLargeDisplayMode).toBe(expected);
        });
      });

    each`
    showInfo | infoTextVisible| isLargeDisplayMode| expected
    ${true}  | ${true}        | ${true}           | ${true}
    ${false} | ${true}        | ${true}           | ${false}
    ${true}  | ${false}       | ${true}           | ${false}
    ${false} | ${false}       | ${true}           | ${false}
    ${true}  | ${true}        | ${false}          | ${false}
    ${false} | ${true}        | ${false}          | ${false}
    ${true}  | ${false}       | ${false}          | ${false}
    ${false} | ${false}       | ${false}          | ${false}
    `
      .describe('infoVisible', ({
        showInfo, infoTextVisible, isLargeDisplayMode, expected,
      }) => {
        const name = JSON.stringify({
          showInfo, infoTextVisible, isLargeDisplayMode, expected,
        });

        it(name, () => {
          const component = new PagerContent({
            showInfo,
            infoTextVisible,
          } as PagerContentProps);
          Object.defineProperty(component, 'isLargeDisplayMode', { get: () => isLargeDisplayMode });
          expect(component.infoVisible).toBe(expected);
        });
      });
  });
});
