/* eslint-disable max-classes-per-file */
import {
  Component, ComponentBindings, JSXComponent,
  Effect, Template, InternalState, ForwardRef, OneWay,
} from 'devextreme-generator/component_declaration/common';

import resizeCallbacks from '../../../core/utils/resize_callbacks';
import PagerProps from './common/pager_props';
import { GetHtmlElement } from './common/types.d';
import { getElementWidth } from './utils/get_element_width';
import { PagerContentProps } from './content';
import { DisposeEffectReturn } from '../../utils/effect_return.d';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  parentRef,
  pageSizesRef,
  infoTextRef,
  pagesRef,
  infoTextVisible,
  isLargeDisplayMode,
  props: { contentTemplate: Content, pagerProps },
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

export function calculateAdaptivityProps({
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

@ComponentBindings()
export class ResizableContainerProps {
  @OneWay() pagerProps!: PagerProps;

  @Template() contentTemplate!: (props: PagerContentProps) => JSX.Element;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ResizableContainer extends JSXComponent<ResizableContainerProps, 'pagerProps' | 'contentTemplate'>(ResizableContainerProps) {
  @ForwardRef() parentRef!: HTMLElement;

  @ForwardRef() pageSizesRef?: GetHtmlElement;

  @ForwardRef() infoTextRef?: GetHtmlElement;

  @ForwardRef() pagesRef!: HTMLElement | undefined;

  @InternalState() infoTextVisible = true;

  @InternalState() isLargeDisplayMode = true;

  @InternalState() elementsWidth: ChildElementsWidth & { isEmpty: boolean } = {
    isEmpty: true,
    pageSizes: 0,
    pages: 0,
    info: 0,
  };

  @Effect() subscribeToResize(): DisposeEffectReturn {
    const callback = (): void => this.updateChildrenProps();
    resizeCallbacks.add(callback);
    return (): void => { resizeCallbacks.remove(callback); };
  }

  @Effect({ run: 'always' }) effectUpdateChildProps(): void {
    const parentWidth = getElementWidth(this.parentRef);
    if (parentWidth > 0) {
      this.updateChildrenProps();
    }
  }

  updateElementsWidth(currentElementsWidth): void {
    this.elementsWidth.isEmpty = false;
    this.elementsWidth.pageSizes = currentElementsWidth.pageSizes;
    this.elementsWidth.info = currentElementsWidth.info;
    this.elementsWidth.pages = currentElementsWidth.pages;
  }

  // Vitik generator problem if use same name for updateChildProps and updateChildrenProps
  updateChildrenProps(): void {
    const elementsWidth = getElementsWidth({
      parent: this.parentRef,
      pageSizes: this.pageSizesRef?.getHtmlElement(),
      info: this.infoTextRef?.getHtmlElement(),
      pages: this.pagesRef,
    });
    const current = calculateAdaptivityProps(elementsWidth);
    const isNotFittedWithCurrentWidths = (!current.infoTextVisible && this.infoTextVisible)
    || (!current.isLargeDisplayMode && this.isLargeDisplayMode);
    if (this.elementsWidth.isEmpty || isNotFittedWithCurrentWidths) {
      this.updateElementsWidth(elementsWidth);
      this.infoTextVisible = current.infoTextVisible;
      this.isLargeDisplayMode = current.isLargeDisplayMode;
    } else {
      const cached = calculateAdaptivityProps({
        parent: elementsWidth.parent,
        ...this.elementsWidth,
      });
      if (cached.infoTextVisible && cached.isLargeDisplayMode) {
        this.updateElementsWidth(elementsWidth);
      }
      this.infoTextVisible = cached.infoTextVisible;
      this.isLargeDisplayMode = cached.isLargeDisplayMode;
    }
  }
}
