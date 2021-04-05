import {
  Component, ComponentBindings, JSXComponent,
  Effect, Template, InternalState, OneWay, ForwardRef, Mutable, JSXTemplate, RefObject,
} from '@devextreme-generator/declarations';

import resizeCallbacks from '../../../core/utils/resize_callbacks';
import { PagerProps } from './common/pager_props';
import { getElementWidth, getElementStyle } from './utils/get_element_width';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import { PagerContentProps } from './content';
import { isDefined } from '../../../core/utils/type';

export const viewFunction = ({
  parentRef,
  pageSizesRef,
  infoTextRef,
  pagesRef,
  infoTextVisible,
  isLargeDisplayMode,
  props: { contentTemplate: Content, pagerProps },
  restAttributes,
}: ResizableContainer): JSX.Element => (
  <Content
    rootElementRef={parentRef}
    pageSizesRef={pageSizesRef}
    infoTextRef={infoTextRef}
    pagesRef={pagesRef}
    infoTextVisible={infoTextVisible}
    isLargeDisplayMode={isLargeDisplayMode}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...{ ...pagerProps, ...restAttributes }}
  />
);
interface ChildElements<T> { pageSizes: T; pages: T; info: T }
interface AllElements<T> extends ChildElements<T> { parent: T }
interface ChildElementProps {
  infoTextVisible: boolean;
  isLargeDisplayMode: boolean;
}

export function calculateAdaptivityProps({
  parent: parentWidth, pageSizes: pageSizesWidth,
  pages: pagesWidth, info: infoWidth,
}: AllElements<number>): ChildElementProps {
  const minimalWidth = pageSizesWidth + pagesWidth + infoWidth;
  const infoTextVisible = parentWidth - minimalWidth > 0;
  const isLargeDisplayMode = parentWidth - (pageSizesWidth + pagesWidth) > 0;
  return {
    infoTextVisible,
    isLargeDisplayMode,
  };
}

function getElementsWidth({
  parent, pageSizes, pages, info,
}: AllElements<HTMLElement | null | undefined>): AllElements<number> {
  const parentWidth = getElementWidth(parent);
  const pageSizesWidth = getElementWidth(pageSizes);
  const infoWidth = getElementWidth(info);
  const pagesHtmlWidth = getElementWidth(pages);
  return {
    parent: parentWidth,
    pageSizes: pageSizesWidth,
    info: infoWidth + getElementStyle('marginLeft', info) + getElementStyle('marginRight', info),
    pages: pagesHtmlWidth,
  };
}

@ComponentBindings()
export class ResizableContainerProps {
  @OneWay() pagerProps!: PagerProps;

  @Template() contentTemplate!: JSXTemplate<PagerContentProps>;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ResizableContainer extends JSXComponent<ResizableContainerProps, 'pagerProps' | 'contentTemplate'>() {
  @ForwardRef() parentRef!: RefObject<HTMLDivElement>;

  @ForwardRef() pageSizesRef!: RefObject<HTMLDivElement>;

  @ForwardRef() infoTextRef!: RefObject<HTMLDivElement>;

  @ForwardRef() pagesRef!: RefObject<HTMLElement>;

  @InternalState() infoTextVisible = true;

  @InternalState() isLargeDisplayMode = true;

  @Mutable() elementsWidth!: ChildElements<number>;

  @Mutable() actualAdaptivityProps!: { infoTextVisible: boolean; isLargeDisplayMode: boolean };

  @Effect() subscribeToResize(): DisposeEffectReturn {
    const callback = (): void => { this.updateAdaptivityProps(); };
    resizeCallbacks.add(callback);
    return (): void => { resizeCallbacks.remove(callback); };
  }

  @Effect({ run: 'always' }) effectUpdateChildProps(): void {
    const parentWidth = this.parentRef.current ? getElementWidth(this.parentRef.current) : 0;
    if (parentWidth > 0) {
      this.updateAdaptivityProps();
    }
  }

  updateAdaptivityProps(): void {
    const currentElementsWidth = getElementsWidth({
      parent: this.parentRef.current,
      pageSizes: this.pageSizesRef.current,
      info: this.infoTextRef.current,
      pages: this.pagesRef.current,
    });
    if (isDefined(this.actualAdaptivityProps)
    && ((this.actualAdaptivityProps.infoTextVisible !== this.infoTextVisible
      || this.actualAdaptivityProps.isLargeDisplayMode !== this.isLargeDisplayMode))) {
      return;
    }
    const isEmpty = !isDefined(this.elementsWidth);
    if (isEmpty) {
      this.elementsWidth = {} as ChildElements<number>;
    }
    if (isEmpty || this.isLargeDisplayMode) {
      this.elementsWidth.pageSizes = currentElementsWidth.pageSizes;
      this.elementsWidth.pages = currentElementsWidth.pages;
    }
    if (isEmpty || this.infoTextVisible) {
      this.elementsWidth.info = currentElementsWidth.info;
    }
    this.actualAdaptivityProps = calculateAdaptivityProps({
      parent: currentElementsWidth.parent,
      ...this.elementsWidth,
    });
    this.infoTextVisible = this.actualAdaptivityProps.infoTextVisible;
    this.isLargeDisplayMode = this.actualAdaptivityProps.isLargeDisplayMode;
  }
}
