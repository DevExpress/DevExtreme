import {
  Component, ComponentBindings, JSXComponent,
  Effect, Template, InternalState, ForwardRef,
} from 'devextreme-generator/component_declaration/common';

import resizeCallbacks from '../../../core/utils/resize_callbacks';
import PagerProps from './common/pager_props';
import { GetHtmlElement } from './common/types.d';
import { getElementWidth } from './utils/get_element_width';
// bug in generator: Max call stack
// import { TwoWayProps } from './pager-content';
// import type PagerContentProps from './pager-content';

// TODO Vitik: move to declaration common types
type EffectCallback = () => void | (() => void);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  parentRef,
  pageSizesRef,
  infoTextRef,
  pagesRef,
  infoTextVisible,
  isLargeDisplayMode,
  pagerProps,
  props: { contentTemplate: Content },
  restAttributes,
}: ResizableContainer) => (
  <Content
    parentRef={parentRef}
    pageSizesRef={pageSizesRef}
    infoTextRef={infoTextRef}
    pagesRef={pagesRef}
    infoTextVisible={infoTextVisible}
    isLargeDisplayMode={isLargeDisplayMode}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...{ ...pagerProps, ...restAttributes }}
  />
);
type ChildElementsName = 'pageSizes' | 'pages' | 'info';
type AllElementsName = 'parent' | ChildElementsName;
type AllElementsWidth = Record<AllElementsName, number>;
type ChildElementsWidth = Record<ChildElementsName, number>;
type HTMLRefType = Record<AllElementsName, HTMLElement | undefined>;
interface ChildElementProps {
  infoTextVisible: boolean;
  isLargeDisplayMode: boolean;
}

export function getContentProps({
  parent: parentWidth, pageSizes: pageSizesWidth,
  pages: pagesWidth, info: infoWidth,
}: AllElementsWidth): ChildElementProps {
  const minimalWidth = pageSizesWidth + pagesWidth;
  const infoTextVisible = parentWidth - minimalWidth > 0;
  const isLargeDisplayMode = parentWidth - (pageSizesWidth + (pagesWidth - infoWidth)) > 0;
  return {
    infoTextVisible,
    isLargeDisplayMode,
  };
}

function getElementsWidth({
  parent, pageSizes, pages, info,
}: HTMLRefType): AllElementsWidth {
  const parentWidth = getElementWidth(parent);
  const pageSizesWidth = getElementWidth(pageSizes);
  const infoWidth = getElementWidth(info);
  const pagesHtmlWidth = getElementWidth(pages);
  return {
    parent: parentWidth,
    pageSizes: pageSizesWidth,
    info: infoWidth,
    pages: pagesHtmlWidth,
  };
}

function updateElementsWidthIfNeed(
  elementsWidth: ChildElementsWidth,
  currentElementsWidth: ChildElementsWidth,
): ChildElementsWidth {
  const updated = {
    pageSizes: Math.max(elementsWidth.pageSizes, currentElementsWidth.pageSizes),
    info: Math.max(elementsWidth.info, currentElementsWidth.info),
    pages: Math.max(elementsWidth.pages, currentElementsWidth.pages),
  };
  const isEqual = (elementsWidth.pageSizes === updated.pageSizes)
  && (elementsWidth.pages === updated.pages)
  && (elementsWidth.info === updated.info);
  return isEqual ? elementsWidth : updated;
}
export function updateChildProps(
  parentRef: HTMLElement,
  pageSizesHtmlRef: GetHtmlElement| undefined,
  infoTextRef: GetHtmlElement| undefined,
  pagesRef: HTMLElement | undefined,
  elementsWidth: ChildElementsWidth,
):
  { elementsWidth: ChildElementsWidth } & ChildElementProps {
  const { parent: parentWidth, ...currentElementsWidth } = getElementsWidth({
    parent: parentRef,
    pageSizes: pageSizesHtmlRef?.getHtmlElement(),
    info: infoTextRef?.getHtmlElement(),
    pages: pagesRef,
  });
  const newElementsWidth = updateElementsWidthIfNeed(elementsWidth, currentElementsWidth);
  const { infoTextVisible, isLargeDisplayMode } = getContentProps({
    parent: parentWidth,
    ...newElementsWidth,
  });
  return {
    elementsWidth: newElementsWidth,
    infoTextVisible,
    isLargeDisplayMode,
  };
}

@ComponentBindings()
export class ResizableContainerProps extends PagerProps {
  // TODO Vitik: bug in generator it should be @Template() content!: ContentPagerProps;
  @Template() contentTemplate: any;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ResizableContainer extends JSXComponent(ResizableContainerProps) {
  @ForwardRef() parentRef!: HTMLElement;

  @ForwardRef() pageSizesRef?: GetHtmlElement;

  @ForwardRef() infoTextRef?: GetHtmlElement;

  @ForwardRef() pagesRef!: HTMLElement | undefined;

  @InternalState() infoTextVisible = true;

  @InternalState() isLargeDisplayMode = true;

  @InternalState() parentWidth = -1;

  @InternalState() elementsWidth: ChildElementsWidth = {
    pageSizes: 0,
    pages: 0,
    info: 0,
  };

  @Effect({ run: 'once' }) subscribeToResize(): EffectCallback {
    const callback = (): void => this.updateChildrenProps();
    resizeCallbacks.add(callback);
    return (): void => { resizeCallbacks.remove(callback); };
  }

  @Effect() effectUpdateChildProps(): void {
    const parentWidth = getElementWidth(this.parentRef);
    if ((this.parentWidth === -1 && parentWidth > 0) || this.parentWidth === parentWidth) {
      this.updateChildrenProps();
    }
  }

  get pagerProps(): PagerProps {
    const { contentTemplate, ...pagerProps } = this.props;
    return pagerProps;
  }

  // Vitik generator problem if use same name for updateChildProps and updateChildrenProps
  updateChildrenProps(): void {
    const { isLargeDisplayMode, infoTextVisible, elementsWidth } = updateChildProps(
      this.parentRef, this.pageSizesRef, this.infoTextRef, this.pagesRef,
      this.elementsWidth,
    );
    this.elementsWidth = elementsWidth;
    this.infoTextVisible = infoTextVisible;
    this.isLargeDisplayMode = isLargeDisplayMode;
  }
}
