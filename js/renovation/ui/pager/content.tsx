// A lot of refs needed any
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component, ComponentBindings, JSXComponent, OneWay, ForwardRef,
} from 'devextreme-generator/component_declaration/common';

import { InfoText } from './info';
import { PageIndexSelector } from './pages/page_index_selector';
import { PageSizeSelector } from './page_size/selector';
import { PAGER_PAGES_CLASS, LIGHT_MODE_CLASS, PAGER_CLASS } from './common/consts';
import PagerProps from './common/pager_props';
import { combineClasses } from '../../utils/combine_classes';

const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  className,
  pagesContainerVisible,
  pagesContainerVisibility,
  isLargeDisplayMode,
  infoVisible,
  props: {
    parentRef, pageSizesRef, pagesRef, infoTextRef,
    pageSizeChange, pageIndexChange,
    infoText, maxPagesCount, pageIndex, hasKnownLastPage,
    pageCount, showPageSizes, pageSize, pageSizes,
    pagesCountText, rtlEnabled,
    showNavigationButtons, totalCount,
  },
  restAttributes,
}: PagerContentComponent) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div ref={parentRef} className={className} {...restAttributes}>
    {showPageSizes && (
    <PageSizeSelector
      ref={pageSizesRef}
      isLargeDisplayMode={isLargeDisplayMode}
      pageSize={pageSize}
      pageSizeChange={pageSizeChange}
      pageSizes={pageSizes}
      rtlEnabled={rtlEnabled}
    />
    )}
    {pagesContainerVisible && (
      <div
        ref={pagesRef}
        className={PAGER_PAGES_CLASS}
        style={{ visibility: pagesContainerVisibility }}
      >
        {infoVisible && (
        <InfoText
          ref={infoTextRef}
          infoText={infoText}
          pageCount={pageCount}
          pageIndex={pageIndex}
          totalCount={totalCount}
        />
        )}
        <PageIndexSelector
          hasKnownLastPage={hasKnownLastPage}
          isLargeDisplayMode={isLargeDisplayMode}
          maxPagesCount={maxPagesCount}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageIndexChange={pageIndexChange}
          pagesCountText={pagesCountText}
          rtlEnabled={rtlEnabled}
          showNavigationButtons={showNavigationButtons}
          totalCount={totalCount}
        />
      </div>
    )}
  </div>
);

/* Vitik bug in generator try to use in resizable-container
export type TwoWayProps = {
  pageIndexChange?: (pageIndex: number) => void;
  pageSizeChange?: (pageSize: number) => void;
}; */

@ComponentBindings()
export class PagerContentProps extends PagerProps /* bug in generator  implements TwoWayProps */ {
  @OneWay() infoTextVisible = true;

  @OneWay() isLargeDisplayMode = true;

  @ForwardRef() pageSizesRef: any = null;

  @ForwardRef() parentRef: any = null;

  @ForwardRef() pagesRef: any = null;

  @ForwardRef() infoTextRef: any = null;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PagerContentComponent extends JSXComponent(PagerContentProps) {
  get infoVisible(): boolean {
    const { showInfo, infoTextVisible } = this.props as Required<PagerContentProps>;
    return showInfo && infoTextVisible;
  }

  get pagesContainerVisible(): boolean {
    return !!this.props.pagesNavigatorVisible && (this.props.pageCount as number) > 0;
  }

  get pagesContainerVisibility(): 'hidden' | undefined {
    if (this.props.pagesNavigatorVisible === 'auto' && this.props.pageCount === 1 && this.props.hasKnownLastPage) {
      return 'hidden';
    }
    return undefined;
  }

  get isLargeDisplayMode(): boolean {
    return !this.props.lightModeEnabled && this.props.isLargeDisplayMode;
  }

  get className(): string {
    const userClasses = this.props.className!;
    const classesMap = {
      'dx-widget': true,
      [userClasses]: !!userClasses,
      [PAGER_CLASS]: true,
      [STATE_INVISIBLE_CLASS]: !this.props.visible,
      [LIGHT_MODE_CLASS]: !this.isLargeDisplayMode,
    };
    return combineClasses(classesMap);
  }
}
