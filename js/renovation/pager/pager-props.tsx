import { ComponentBindings, OneWay, TwoWay } from 'devextreme-generator/component_declaration/common';

@ComponentBindings()
export default class PagerProps {
  // tODO messageLocalization.getFormatter('dxPager-infoText'),
  @OneWay() showInfo?: boolean = false;

  @OneWay() infoTextMessageTemplate?: string = 'Page {0} of {1} ({2} items)';

  @OneWay() lightModeEnabled?: boolean = false;

  @OneWay() maxPagesCount?: number = 10;

  @OneWay() pageCount?: number = 10;

  // tODO messageLocalization.getFormatter('dxPager-pagesCountText');
  @OneWay() pagesCountText?: string = 'Of';

  // visible: true,
  // pagesNavigatorVisible: 'auto',
  @TwoWay() pageIndex?: number = 0;

  @TwoWay() pageSize?: number = 5;

  // showPageSizes: true,

  @OneWay() pageSizes?: number[] = [5, 10];

  @OneWay() rtlEnabled?: boolean = false;

  @OneWay() showNavigationButtons?: boolean = false;

  @OneWay() totalCount?: number = 0;

  // hasKnownLastPage: true,
}
