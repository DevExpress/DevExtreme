// A lot of refs needed any
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component, ComponentBindings, JSXComponent, OneWay, Event,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import InfoText from './info';
import PageIndexSelector from './page-index-selector';
import PageSizeSelector from './page-size-selector';
import { PAGER_PAGES_CLASS, PAGER_CLASS_FULL, LIGHT_MODE_CLASS } from './consts';
import PagerProps from './pager-props';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  className,
  isLargeDisplayMode,
  props: {
    parentRef, pageSizesRef, pagesRef, infoTextRef,
    infoTextVisible,
    pageSizeChange, pageIndexChange,
    infoText, maxPagesCount, pageIndex,
    pageCount, pageSize, pageSizes,
    pagesCountText, rtlEnabled,
    showNavigationButtons, totalCount,
    showInfo,
  },
  restAttributes,
}: PagerContentComponent) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div ref={parentRef as any} {...restAttributes} className={className}>
    <PageSizeSelector
      ref={pageSizesRef as any}
      isLargeDisplayMode={isLargeDisplayMode}
      pageSize={pageSize}
      pageSizeChange={pageSizeChange}
      pageSizes={pageSizes}
      rtlEnabled={rtlEnabled}
    />
    <div ref={pagesRef as any} className={PAGER_PAGES_CLASS}>
      <PageIndexSelector
                // hasKnownLastPage={hasKnownLastPage}
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
      {showInfo && infoTextVisible && (
        <InfoText
          ref={infoTextRef as any}
          infoText={infoText}
          pageCount={pageCount}
          pageIndex={pageIndex}
          totalCount={totalCount}
        />
      )}
    </div>
  </div>
);

/* Vitik bug in generator try to use in resizable-container
export type TwoWayProps = {
  pageIndexChange?: (pageIndex: number) => void;
  pageSizeChange?: (pageSize: number) => void;
}; */

@ComponentBindings()
export class PagerContentProps extends PagerProps /* bug in generator  implements TwoWayProps */ {
  @Event() pageIndexChange!: (pageIndex: number) => void;

  @Event() pageSizeChange!: (pageSize: number) => void;

  @OneWay() infoTextVisible = true;

  @OneWay() isLargeDisplayMode = true;

  @OneWay() pageSizesRef: any = null;

  @OneWay() parentRef: any = null;

  @OneWay() pagesRef: any = null;

  @OneWay() infoTextRef: any = null;
}

// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export default class PagerContentComponent extends JSXComponent(PagerContentProps) {
  get isLargeDisplayMode(): boolean {
    return !this.props.lightModeEnabled && this.props.isLargeDisplayMode;
  }

  get className(): string {
    return this.isLargeDisplayMode ? PAGER_CLASS_FULL : `${PAGER_CLASS_FULL} ${LIGHT_MODE_CLASS}`;
  }
}
