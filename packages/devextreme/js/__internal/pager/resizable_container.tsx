/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@devextreme-generator/declarations';
import { createRef as infernoCreateRef } from 'inferno';

import resizeCallbacks from '../../core/utils/resize_callbacks';
import { isDefined } from '../../core/utils/type';
import type { DisposeEffectReturn } from '../core/r1/utils/effect_return';
import { PagerDefaultProps, type PagerProps } from './common/pager_props';
import type { RefObject } from './common/types';
import type { PagerContentProps } from './content';
import { getElementContentWidth, getElementStyle, getElementWidth } from './utils/get_element_width';

interface ChildElements<T> { pageSizes: T; pages: T; info: T }
interface MainElements<T> { parent: T; pageSizes: T; pages: T }
interface AllElements<T> extends ChildElements<T> { parent: T }

export function calculateLargeDisplayMode({
  parent: parentWidth,
  pageSizes: pageSizesWidth,
  pages: pagesWidth,
}: MainElements<number>): boolean {
  return parentWidth - (pageSizesWidth + pagesWidth) > 0;
}

export function calculateInfoTextVisible({
  parent: parentWidth, pageSizes: pageSizesWidth,
  pages: pagesWidth, info: infoWidth,
}: AllElements<number>): boolean {
  const minimalWidth = pageSizesWidth + pagesWidth + infoWidth;
  return parentWidth - minimalWidth > 0;
}

function getElementsWidth({
  parent, pageSizes, pages, info,
}: AllElements<HTMLElement | null | undefined>): AllElements<number> {
  const parentWidth = getElementContentWidth(parent);
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

export interface ResizableContainerProps {
  pagerProps: PagerProps;
  contentTemplate: JSXTemplate<PagerContentProps, 'pageSizeChange' | 'pageIndexChange'>;
}

export const ResizableContainerDefaultProps = {
  pagerProps: { ...PagerDefaultProps },
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

  public pageSizesRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

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
        this.props.pagerProps,
        this.props.contentTemplate,
      ])];
  }

  updateEffects(): void {
    this._effects[0]?.update([this.state.infoTextVisible, this.state.isLargeDisplayMode]);
    this._effects[1]?.update([
      this.props,
      this.state.infoTextVisible,
      this.state.isLargeDisplayMode,
      this.props.pagerProps,
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

  getContentAttributes(): PagerProps {
    const {
      className,
      displayMode,
      gridCompatibility,
      hasKnownLastPage,
      infoText,
      label,
      lightModeEnabled,
      maxPagesCount,
      onKeyDown,
      pageCount,
      pageIndex,
      pageIndexChange,
      pageSize,
      pageSizeChange,
      pageSizes,
      pagesCountText,
      pagesNavigatorVisible,
      rtlEnabled,
      showInfo,
      showNavigationButtons,
      showPageSizes,
      totalCount,
      visible,
    } = this.props.pagerProps;

    return {
      pageSize,
      pageIndex,
      pageIndexChange,
      pageSizeChange,
      gridCompatibility,
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
      showPageSizes,
      pageSizes,
      rtlEnabled,
      showNavigationButtons,
      totalCount,
      onKeyDown,
      label,
    };
  }

  getParentWidth(): number {
    return this.parentRef?.current ? getElementWidth(this.parentRef.current) : 0;
  }

  updateAdaptivityProps(): void {
    const currentElementsWidth = getElementsWidth({
      parent: this.parentRef?.current,
      pageSizes: this.pageSizesRef?.current,
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
      this.elementsWidth.pageSizes = currentElementsWidth.pageSizes;
      this.elementsWidth.pages = currentElementsWidth.pages;
    }
    if (isEmpty || this.state.infoTextVisible) {
      this.elementsWidth.info = currentElementsWidth.info;
    }
    this.actualIsLargeDisplayMode = calculateLargeDisplayMode(
      {
        parent: currentElementsWidth.parent,
        pageSizes: this.elementsWidth.pageSizes,
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
        pageSizesRef={this.pageSizesRef}
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
