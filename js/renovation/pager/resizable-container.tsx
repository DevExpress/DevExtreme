import {
  Component, ComponentBindings, JSXComponent,
  Ref, Effect, Template, InternalState, Event,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import resizeCallbacks from '../../core/utils/resize_callbacks';
import PagerProps from './pager-props';
import type { GetHtmlElement } from './pager.types.d';
import { getElementWidth } from './utils/get-element-width';
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
  props: { contentTemplate: Content, ...pagerProps },
}: ResizableContainer) => (
  <Content
    parentRef={parentRef}
    pageSizesRef={pageSizesRef}
    infoTextRef={infoTextRef}
    pagesRef={pagesRef}
    infoTextVisible={infoTextVisible}
    isLargeDisplayMode={isLargeDisplayMode}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...pagerProps as PagerProps}
  />
);
type ChildElementsName = 'pageSizes' | 'pages' | 'info';
type AllElementsName = 'parent' | ChildElementsName;
type AllElementsWidth = Record<AllElementsName, number>;
type ChildElementsWidth = Record<ChildElementsName, number>;
type HTMLRefType = Record<AllElementsName, HTMLElement | undefined>;
type ChildElementProps = {
  infoTextVisible: boolean;
  isLargeDisplayMode: boolean;
};

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
    pageSizes: Math.max(elementsWidth.pageSizes || 0,
      currentElementsWidth.pageSizes || 0),
    info: Math.max(elementsWidth.info || 0, currentElementsWidth.info || 0),
    pages: Math.max(elementsWidth.pages || 0, currentElementsWidth.pages || 0),
  };
  const isEqual = (elementsWidth.pageSizes === updated.pageSizes)
  && (elementsWidth.pages === updated.pages)
  && (elementsWidth.info === updated.info);
  return isEqual ? elementsWidth : updated;
}
export function updateChildProps(
  parentRef: HTMLElement,
  pageSizesHtmlRef: GetHtmlElement, infoTextRef: GetHtmlElement, pagesRef: HTMLElement,
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
  @Event() pageIndexChange!: (pageIndex: number) => void;

  @Event() pageSizeChange!: (pageSize: number) => void;

  // TODO Vitik: bug in generator it should be @Template() content!: ContentPagerProps;
  @Template() contentTemplate: any;
}
// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class ResizableContainer extends JSXComponent(ResizableContainerProps) {
  @Ref() parentRef!: HTMLElement;

  @Ref() pageSizesRef!: GetHtmlElement;

  @Ref() infoTextRef!: GetHtmlElement;

  @Ref() pagesRef!: HTMLElement;

  @InternalState() infoTextVisible = true;

  @InternalState() isLargeDisplayMode = true;

  elementsWidth: ChildElementsWidth = {
    pageSizes: 0,
    pages: 0,
    info: 0,
  };

  @Effect() subscribeToResize(): EffectCallback {
    resizeCallbacks.add(this.updateChildrenProps);
    return (): void => { resizeCallbacks.remove(this.updateChildrenProps); };
  }

  @Effect() effectUpdateChildProps(): void {
    this.updateChildrenProps();
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
