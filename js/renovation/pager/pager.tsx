// import { h } from 'preact';
import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from 'devextreme-generator/component_declaration/common';
import noop from '../utils/noop';
import InfoText from './info';
import PageIndexSelector from './page-index-selector';
import PageSizeSelector from './page-size-selector';
import { PAGER_PAGES_CLASS, PAGER_CLASS_FULL, LIGHT_MODE_CLASS } from './consts';

// import { getFormatter } from '../../localization/message';


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  className,
  pageSizeChange,
  isLargeDisplayMode,
  pageIndexChange,
  props: {
    infoTextMessageTemplate, maxPagesCount, pageIndex,
    pageCount, pageSize, pageSizes,
    pagesCountText, rtlEnabled,
    showNavigationButtons, totalCount,
  },
}: Pager) => (
  <div className={className}>
    <PageSizeSelector
      isLargeDisplayMode={isLargeDisplayMode}
      pageSize={pageSize}
      pageSizeChanged={pageSizeChange}
      pageSizes={pageSizes}
      rtlEnabled={rtlEnabled}
    />
    <div className={PAGER_PAGES_CLASS}>
      <InfoText
        infoTextMessageTemplate={infoTextMessageTemplate}
        pageCount={pageCount}
        pageIndex={pageIndex}
        totalCount={totalCount}
      />
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
    </div>
  </div>
);

@ComponentBindings()
export class PagerProps {
  // tODO messageLocalization.getFormatter('dxPager-infoText'),
  @OneWay() infoTextMessageTemplate?: string = 'Page {0} of {1} ({2} items)';

  @OneWay() lightModeEnabled?: boolean = false;

  @OneWay() maxPagesCount?: number = 10;

  @OneWay() pageCount?: number = 10;

  // visible: true,
  // pagesNavigatorVisible: 'auto',
  @TwoWay() pageIndex?: number = 0;

  // tODO messageLocalization.getFormatter('dxPager-pagesCountText');
  @OneWay() pagesCountText?: string = 'Of';

  @TwoWay() pageSize?: number = 5;

  // showPageSizes: true,
  @Event() pageSizeChange?: (pageSize: number) => void = noop;

  @OneWay() pageSizes?: number[] = [5, 10];

  @OneWay() rtlEnabled?: boolean = false;

  @OneWay() showNavigationButtons?: boolean = false;

  @OneWay() totalCount?: number = 0;
  // hasKnownLastPage: true,
  // showInfo: false,
}

// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Pager extends JSXComponent<PagerProps> {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get isLargeDisplayMode() { return !this.props.lightModeEnabled; }

  get className(): string {
    return this.isLargeDisplayMode ? PAGER_CLASS_FULL : `${PAGER_CLASS_FULL}  ${LIGHT_MODE_CLASS}`;
  }

  pageIndexChange(newPageIndex: number): void {
    this.props.pageIndex = newPageIndex;
  }

  pageSizeChange(newPageSize: number): void {
    this.props.pageSize = newPageSize;
  }
}
