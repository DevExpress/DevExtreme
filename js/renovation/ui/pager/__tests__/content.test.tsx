/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef, forwardRef } from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import { RefObject } from '@devextreme-generator/declarations';
import { AbstractFunction } from '../../../common/types';
import { createTestRef } from '../../../test_utils/create_ref';
import { PagerContent, PagerContentProps, viewFunction as PagerContentComponent } from '../content';
import { PageIndexSelector } from '../pages/page_index_selector';
import { PageSizeSelector } from '../page_size/selector';
import { InfoText } from '../info';
import { Widget } from '../../common/widget';
import { registerKeyboardAction } from '../../../../ui/shared/accessibility';

let mockInstance: Record<string, AbstractFunction> = {};

jest.mock('../../../../ui/shared/accessibility', () => ({
  registerKeyboardAction: jest.fn((_, instance) => {
    mockInstance = instance;
  }),
}));
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
        pageIndexSelectorVisible: true,
        props: componentProps,
        restAttributes: { 'rest-attribute': {}, className: 'className' },
      } as Partial<PagerContent> as PagerContent;
      const tree = mount(<PagerContentComponent {...props as any} />);
      const widget = tree.childAt(0);
      expect(widget.props()).toMatchObject({
        rtlEnabled: true,
        className: 'className',
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
      expect(pagesContainer.childAt(1).childAt(0).props()).toMatchObject({
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

    it('visible = false', () => {
      const rootElementRef = { current: {} } as RefObject<HTMLElement>;
      const props = {
        props: {
          visible: false,
          rootElementRef,
        },
      } as Partial<PagerContent>;
      const widget = mount(<PagerContentComponent {...props as any} /> as any).childAt(0);
      expect(widget.props()).toMatchObject({
        visible: false,
      });
    });

    it('pagesContainerVisibility = false', () => {
      const rootElementRef = { current: {} } as RefObject<HTMLElement>;
      const props = {
        pagesContainerVisible: true,
        pagesContainerVisibility: 'hidden',
        props: {
          rootElementRef,
        },
      } as Partial<PagerContent>;
      const tree = mount(<PagerContentComponent {...props as any} /> as any).childAt(0);
      expect((tree.find('.dx-pages').instance() as unknown as HTMLElement).style).toHaveProperty('visibility', 'hidden');
    });

    it('pagesContainerVisible = false', () => {
      const rootElementRef = { current: {} } as RefObject<HTMLElement>;
      const tree = mount(<PagerContentComponent
        {...{
          pagesContainerVisible: false,
          props: {
            rootElementRef,
          },
        } as Partial<PagerContent> as any}
      /> as any).childAt(0);
      expect(tree.find('.dx-pages')).toHaveLength(0);
    });

    it('infoVisible = false', () => {
      const rootElementRef = { current: {} } as RefObject<HTMLElement>;
      const tree = mount(<PagerContentComponent
        {...{
          pagesContainerVisible: true,
          infoVisible: false,
          props: {
            rootElementRef,
          },
        } as Partial<PagerContent> as any}
      /> as any).childAt(0);
      const pagesContainer = tree.childAt(0);
      expect(tree.find(InfoText)).toHaveLength(0);
      expect(pagesContainer).toHaveLength(1);
    });

    it('pageIndexSelectorVisible = false', () => {
      const rootElementRef = { current: {} } as RefObject<HTMLElement>;
      const tree = mount(<PagerContentComponent
        {...{
          pagesContainerVisible: true,
          pageIndexSelectorVisible: false,
          props: {
            rootElementRef,
          },
        } as Partial<PagerContent> as any}
      /> as any).childAt(0);
      const pagesContainer = tree.childAt(0);
      expect(tree.find(PageIndexSelector)).toHaveLength(0);
      expect(pagesContainer).toHaveLength(1);
    });

    it('showPageSizes = false', () => {
      const rootElementRef = { current: {} } as RefObject<HTMLDivElement>;
      const props = {
        props: {
          showPageSizes: false,
          rootElementRef,
        } as Partial<PagerContentProps>,
      } as PagerContent;
      const tree = mount(<PagerContentComponent
        {...props as any}
      />).childAt(0);
      expect(tree).toHaveLength(1);
      expect(tree.find(PageSizeSelector)).toHaveLength(0);
    });

    it('forwarded refs', () => {
      const widgetRootElementRef = { current: {} } as RefObject<HTMLDivElement>;
      const pageSizesRef = { current: {} } as RefObject<HTMLElement>;
      const pagesRef = createRef() as any; // {} as HTMLDivElement;
      const infoTextRef = { current: {} } as RefObject<HTMLElement>;
      const props = {
        pagesContainerVisible: true,
        isLargeDisplayMode: true,
        infoVisible: true,
        pageIndexSelectorVisible: true,
        widgetRootElementRef,
        props: {
          rtlEnabled: false,
          showPageSizes: true,
          pageSizesRef,
          pagesRef,
          infoTextRef,
        },
      } as PagerContent;
      const tree = mount(<PagerContentComponent {...props as any} />).childAt(0);
      expect(tree.props().rootElementRef).toBe(widgetRootElementRef);
      const childrenContainer = tree.find('div').first();
      expect(childrenContainer.childAt(0).props().rootElementRef).toBe(pageSizesRef);
      expect(childrenContainer.childAt(1).childAt(1).instance()).toBe(pagesRef.current);
      expect(childrenContainer.childAt(1).childAt(0).props().rootElementRef).toBe(infoTextRef);
    });
  });

  describe('Logic', () => {
    it('setRootElementRef, has rootElementRef', () => {
      const component = new PagerContent({ rootElementRef: {} } as PagerContentProps);
      component.widgetRootElementRef = { current: {} } as RefObject<HTMLElement>;
      component.setRootElementRef();
      expect(component.props.rootElementRef?.current).toBe(component.widgetRootElementRef.current);
    });

    it('setRootElementRef, hasnt rootElementRef', () => {
      const component = new PagerContent({} as PagerContentProps);
      component.widgetRootElementRef = { current: {} } as RefObject<HTMLElement>;
      component.setRootElementRef();
      expect(component.props.rootElementRef?.current).toBeUndefined();
    });

    it('keyboardAction provider', () => {
      const rootElement = { el: 1 };
      const element = {} as HTMLElement;
      const action = jest.fn();
      const component = new PagerContent({
        pageCount: 1,
        pagesNavigatorVisible: 'auto',
      } as PagerContentProps);
      component.widgetRootElementRef = createTestRef(rootElement);
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
      expect(mockInstance.element()).toBe(rootElement);
      expect(mockInstance.option()).toBe(false);
      // eslint-disable-next-line no-underscore-dangle
      expect(mockInstance._createActionByOption()).toEqual(expect.any(Function));
    });

    it('keyboardAction provider _createActionByOption if onKeyDown prop is defined', () => {
      const element = {} as HTMLElement;
      const action = () => { };
      const onKeyDownArgs = {};
      const onKeyDownMock = jest.fn();
      const component = new PagerContent({
        onKeyDown: onKeyDownMock as any,
      } as PagerContentProps);

      component.keyboardAction.registerKeyboardAction(element, action);

      // eslint-disable-next-line no-underscore-dangle
      mockInstance._createActionByOption()(onKeyDownArgs);

      expect(onKeyDownMock).toHaveBeenCalledWith(onKeyDownArgs);
    });

    it('keyboardAction provider _createActionByOption if onKeyDown prop is not defined', () => {
      const element = {} as HTMLElement;
      const action = () => { };
      const component = new PagerContent({
      } as PagerContentProps);

      component.keyboardAction.registerKeyboardAction(element, action);

      // eslint-disable-next-line no-underscore-dangle
      expect(mockInstance._createActionByOption()()).toBeUndefined();
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

    it('pageIndexSelectorVisible', () => {
      const component = new PagerContent({
        pageSize: 0,
      } as PagerContentProps);
      expect(component.pageIndexSelectorVisible).toBe(false);
      component.props.pageSize = 10;
      expect(component.pageIndexSelectorVisible).toBe(true);
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
