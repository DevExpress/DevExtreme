import {
  Component, ComponentBindings, JSXComponent, Fragment,
  Ref, Effect, Template, InternalState, Event,
} from 'devextreme-generator/component_declaration/common';
import noop from '../utils/noop';
import getElementComputedStyle from './get-computed-style';
import resizeCallbacks from '../../core/utils/resize_callbacks';
import PagerProps from './pager-props';
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
  props: { content: Content, ...pagerProps },
}: ResizableContainer) => (
  <Fragment>
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
  </Fragment>
);
export type GetHtmlElement = { getHtmlElement: () => HTMLElement | undefined };
type ChildElementsName = 'pageSizesHtmlEl' | 'pagesHtmlEl' | 'infoHtmlEl';
type AllElementsName = 'parentHtmlEl' | ChildElementsName;
type AllElementsWidth = Record<AllElementsName, number>;
type ChildElementsWidth = Record<ChildElementsName, number>;
type HTMLRefType = Record<AllElementsName, HTMLElement | undefined>;
type ChildElementProps = {
  infoTextVisible: boolean;
  isLargeDisplayMode: boolean;
};

function ToNumber(attribute: string | undefined): number {
  return attribute ? Number(attribute.replace('px', '')) : 0;
}
export function getContentProps({
  parentHtmlEl: parentWidth, pageSizesHtmlEl: pageSizesWidth,
  pagesHtmlEl: pagesHtmlWidth, infoHtmlEl: infoWidth,
}: AllElementsWidth): ChildElementProps {
  const minimalWidth = pageSizesWidth + pagesHtmlWidth;
  const infoTextVisible = parentWidth - minimalWidth > 0;
  const isLargeDisplayMode = parentWidth - (pageSizesWidth + (pagesHtmlWidth - infoWidth)) > 0;
  return {
    infoTextVisible,
    isLargeDisplayMode,
  };
}

function getElementsWidth({
  parentHtmlEl, pageSizesHtmlEl, pagesHtmlEl, infoHtmlEl,
}: HTMLRefType): AllElementsWidth {
  const parentWidth = ToNumber(getElementComputedStyle(parentHtmlEl)?.width);
  const pageSizesWidth = ToNumber(getElementComputedStyle(pageSizesHtmlEl)?.width);
  const infoWidth = ToNumber(getElementComputedStyle(infoHtmlEl)?.width);
  const pagesHtmlWidth = ToNumber(getElementComputedStyle(pagesHtmlEl)?.width);
  return {
    parentHtmlEl: parentWidth,
    pageSizesHtmlEl: pageSizesWidth,
    infoHtmlEl: infoWidth,
    pagesHtmlEl: pagesHtmlWidth,
  };
}

function updateElementsWidthIfNeed(
  elementsWidth: ChildElementsWidth,
  currentElementsWidth: ChildElementsWidth,
): ChildElementsWidth {
  const updated = {
    pageSizesHtmlEl: Math.max(elementsWidth.pageSizesHtmlEl || 0,
      currentElementsWidth.pageSizesHtmlEl || 0),
    infoHtmlEl: Math.max(elementsWidth.infoHtmlEl || 0, currentElementsWidth.infoHtmlEl || 0),
    pagesHtmlEl: Math.max(elementsWidth.pagesHtmlEl || 0, currentElementsWidth.pagesHtmlEl || 0),
  };
  const isEqual = (elementsWidth.pageSizesHtmlEl === updated.pageSizesHtmlEl)
  && (elementsWidth.pagesHtmlEl === updated.pagesHtmlEl)
  && (elementsWidth.infoHtmlEl === updated.infoHtmlEl);
  return isEqual ? elementsWidth : updated;
}
export function updateChildProps(
  parentRef: HTMLElement,
  pageSizesHtmlRef: GetHtmlElement, infoTextRef: GetHtmlElement, pagesRef: HTMLElement,
  elementsWidth: ChildElementsWidth,
):
  { elementsWidth: ChildElementsWidth } & ChildElementProps {
  const { parentHtmlEl: parentWidth, ...currentElementsWidth } = getElementsWidth({
    parentHtmlEl: parentRef,
    pageSizesHtmlEl: pageSizesHtmlRef?.getHtmlElement(),
    infoHtmlEl: infoTextRef?.getHtmlElement(),
    pagesHtmlEl: pagesRef,
  });
  const newElementsWidth = updateElementsWidthIfNeed(elementsWidth, currentElementsWidth);
  const { infoTextVisible, isLargeDisplayMode } = getContentProps({
    parentHtmlEl: parentWidth,
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
  @Event() pageIndexChange?: (pageIndex: number) => void = noop;

  @Event() pageSizeChange?: (pageSize: number) => void = noop;

  // TODO Vitik: bug in generator it should be @Template() content!: ContentPagerProps;
  @Template() content: any;
}
// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class ResizableContainer extends JSXComponent<ResizableContainerProps> {
  @Ref() parentRef!: HTMLElement;

  @Ref() pageSizesRef!: GetHtmlElement;

  @Ref() infoTextRef!: GetHtmlElement;

  @Ref() pagesRef!: HTMLElement;

  @InternalState() infoTextVisible = true;

  @InternalState() isLargeDisplayMode = true;

  elementsWidth: ChildElementsWidth = {
    pageSizesHtmlEl: 0,
    pagesHtmlEl: 0,
    infoHtmlEl: 0,
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
