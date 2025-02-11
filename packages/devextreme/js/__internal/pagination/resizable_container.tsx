/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@ts/core/r1/types';
import { createRef as infernoCreateRef } from 'inferno';

import resizeCallbacks from '../../core/utils/resize_callbacks';
import { isDefined } from '../../core/utils/type';
import type { DisposeEffectReturn } from '../core/r1/utils/effect_return';
import { PaginationDefaultProps, type PaginationProps } from './common/pagination_props';
import type { RefObject } from './common/types';
import type { PaginationContentProps } from './content';
import { getElementContentWidth, getElementStyle, getElementWidth } from './utils/get_element_width';

interface ChildElements<T> { allowedPageSizes: T; pages: T; info: T }
interface MainElements<T> { parent: T; allowedPageSizes: T; pages: T }
interface AllElements<T> extends ChildElements<T> { parent: T }

export function calculateLargeDisplayMode({
  parent: parentWidth,
  allowedPageSizes: pageSizesWidth,
  pages: pagesWidth,
}: MainElements<number>): boolean {
  return parentWidth - (pageSizesWidth + pagesWidth) > 0;
}

export function calculateInfoTextVisible({
  parent: parentWidth, allowedPageSizes: pageSizesWidth,
  pages: pagesWidth, info: infoWidth,
}: AllElements<number>): boolean {
  const minimalWidth = pageSizesWidth + pagesWidth + infoWidth;
  return parentWidth - minimalWidth > 0;
}

function getElementsWidth({
  parent, allowedPageSizes, pages, info,
}: AllElements<HTMLElement | null | undefined>): AllElements<number> {
  const parentWidth = getElementContentWidth(parent);
  const pageSizesWidth = getElementWidth(allowedPageSizes);
  const infoWidth = getElementWidth(info);
  const pagesHtmlWidth = getElementWidth(pages);
  return {
    parent: parentWidth,
    allowedPageSizes: pageSizesWidth,
    info: infoWidth + getElementStyle('marginLeft', info) + getElementStyle('marginRight', info),
    pages: pagesHtmlWidth,
  };
}

export interface ResizableContainerProps {
  paginationProps: PaginationProps;
  contentTemplate: JSXTemplate<PaginationContentProps, 'pageSizeChangedInternal' | 'pageIndexChangedInternal'>;
}

export const ResizableContainerDefaultProps = {
  paginationProps: { ...PaginationDefaultProps },
};

export class ResizableContainer extends InfernoComponent<ResizableContainerProps> {
  public state: any = {
    infoTextVisible: true,
    isLargeDisplayMode: true,
  };

  public refs: any = null;

  public parentRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

  public infoTextRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

  public pagesRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

  // eslint-disable-next-line max-len
  public allowedPageSizesRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

  public elementsWidth: ChildElements<number> = {} as ChildElements<number>;

  public actualIsLargeDisplayMode = true;

  public actualInfoTextVisible = true;

  constructor(props) {
    super(props);
    this.subscribeToResize = this.subscribeToResize.bind(this);
    this.effectUpdateChildProps = this.effectUpdateChildProps.bind(this);
    this.updateAdaptivityProps = this.updateAdaptivityProps.bind(this);
  }

  componentWillUpdate(nextProps: ResizableContainerProps, nextState, context): void {
    super.componentWillUpdate(nextProps, nextState, context);
  }

  createEffects(): InfernoEffect[] {
    return [
      new InfernoEffect(this.subscribeToResize, [
        this.state.infoTextVisible,
        this.state.isLargeDisplayMode,
      ]),
      new InfernoEffect(this.effectUpdateChildProps, [
        this.props,
        this.state.infoTextVisible,
        this.state.isLargeDisplayMode,
        this.props.paginationProps,
        this.props.contentTemplate,
      ])];
  }

  updateEffects(): void {
    this._effects[0]?.update([this.state.infoTextVisible, this.state.isLargeDisplayMode]);
    this._effects[1]?.update([
      this.props,
      this.state.infoTextVisible,
      this.state.isLargeDisplayMode,
      this.props.paginationProps,
      this.props.contentTemplate,
    ]);
  }

  subscribeToResize(): DisposeEffectReturn {
    const callback = (): void => {
      if (this.getParentWidth() > 0) {
        this.updateAdaptivityProps();
      }
    };
    resizeCallbacks.add(callback);
    return (): void => { resizeCallbacks.remove(callback); };
  }

  effectUpdateChildProps(): void {
    if (this.getParentWidth() > 0) {
      this.updateAdaptivityProps();
    }
  }

  getContentAttributes(): PaginationProps {
    const {
      className,
      displayMode,
      isGridCompatibilityMode,
      hasKnownLastPage,
      infoText,
      label,
      lightModeEnabled,
      maxPagesCount,
      onKeyDown,
      pageCount,
      pageIndex,
      pageIndexChangedInternal,
      pageSize,
      pageSizeChangedInternal,
      allowedPageSizes,
      pagesCountText,
      pagesNavigatorVisible,
      rtlEnabled,
      showInfo,
      showNavigationButtons,
      showPageSizeSelector,
      itemCount,
      visible,
      style,

      width,
      height,
      elementAttr,

      hint,
      disabled,
      tabIndex,
      accessKey,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.props.paginationProps;

    return {
      pageSize,
      pageIndex,
      pageIndexChangedInternal,
      pageSizeChangedInternal,
      isGridCompatibilityMode,
      className,
      showInfo,
      infoText,
      lightModeEnabled,
      displayMode,
      maxPagesCount,
      pageCount,
      pagesCountText,
      visible,
      hasKnownLastPage,
      pagesNavigatorVisible,
      showPageSizeSelector,
      allowedPageSizes,
      rtlEnabled,
      showNavigationButtons,
      itemCount,
      onKeyDown,
      label,
      style,

      width,
      height,
      elementAttr,

      hint,
      disabled,
      tabIndex,
      accessKey,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    };
  }

  getParentWidth(): number {
    return this.parentRef?.current ? getElementWidth(this.parentRef.current) : 0;
  }

  updateAdaptivityProps(): void {
    const currentElementsWidth = getElementsWidth({
      parent: this.parentRef?.current,
      allowedPageSizes: this.allowedPageSizesRef?.current,
      info: this.infoTextRef?.current,
      pages: this.pagesRef?.current,
    });
    if (this.actualInfoTextVisible !== this.state.infoTextVisible
      || this.actualIsLargeDisplayMode !== this.state.isLargeDisplayMode) {
      return;
    }
    const isEmpty = !isDefined(this.elementsWidth);
    if (isEmpty) {
      this.elementsWidth = {} as ChildElements<number>;
    }
    if (isEmpty || this.state.isLargeDisplayMode) {
      this.elementsWidth.allowedPageSizes = currentElementsWidth.allowedPageSizes;
      this.elementsWidth.pages = currentElementsWidth.pages;
    }
    if (isEmpty || this.state.infoTextVisible) {
      this.elementsWidth.info = currentElementsWidth.info;
    }
    this.actualIsLargeDisplayMode = calculateLargeDisplayMode(
      {
        parent: currentElementsWidth.parent,
        allowedPageSizes: this.elementsWidth.allowedPageSizes,
        pages: this.elementsWidth.pages,
      },
    );
    this.actualInfoTextVisible = calculateInfoTextVisible(
      {
        ...currentElementsWidth,
        info: this.elementsWidth.info,
      },
    );
    this.setState(() => ({
      infoTextVisible: this.actualInfoTextVisible,
    }));
    this.setState(() => ({
      isLargeDisplayMode: this.actualIsLargeDisplayMode,
    }));
  }

  render(): JSX.Element {
    const {
      infoTextVisible,
      isLargeDisplayMode,
    } = this.state;
    const {
      props: { contentTemplate: Content },
    } = this;

    return (
      <Content
        rootElementRef={this.parentRef}
        allowedPageSizesRef={this.allowedPageSizesRef}
        infoTextRef={this.infoTextRef}
        pagesRef={this.pagesRef}
        infoTextVisible={infoTextVisible}
        isLargeDisplayMode={isLargeDisplayMode}
        {...this.getContentAttributes()}
      />
    );
  }
}
ResizableContainer.defaultProps = ResizableContainerDefaultProps;
