import {
  ComponentBindings, OneWay, TwoWay, Event,
} from 'devextreme-generator/component_declaration/common';
import messageLocalization from '../../../../localization/message';

@ComponentBindings()
export default class PagerProps {
  @OneWay() gridCompatibility? = true;

  @OneWay() className?: string;

  @OneWay() showInfo?: boolean = false;

  @OneWay() infoText?: string = messageLocalization.getFormatter('dxPager-infoText')();

  @OneWay() lightModeEnabled?: boolean = false;

  @OneWay() maxPagesCount?: number = 10;

  @OneWay() pageCount?: number = 10;

  @OneWay() pagesCountText?: string = messageLocalization.getFormatter('dxPager-pagesCountText')();

  @OneWay() visible?: boolean = true;

  @OneWay() hasKnownLastPage?: boolean = true;

  @OneWay() pagesNavigatorVisible?: boolean | 'auto' = 'auto';

  @TwoWay() pageIndex?: number = 1;

  @Event() pageIndexChange?: (newPageIndex: number) => void;

  @TwoWay() pageSize?: number = 5;

  @Event() pageSizeChange?: (newPageSize: number) => void;

  @OneWay() showPageSizes? = true;

  @OneWay() pageSizes?: number[] = [5, 10];

  @OneWay() rtlEnabled?: boolean = false;

  @OneWay() showNavigationButtons?: boolean = false;

  @OneWay() totalCount?: number = 0;
}
