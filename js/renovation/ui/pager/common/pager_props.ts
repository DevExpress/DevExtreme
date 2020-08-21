import {
  ComponentBindings, OneWay, TwoWay, Event,
} from 'devextreme-generator/component_declaration/common';

@ComponentBindings()
export default class PagerProps {
  @OneWay() gridCompatibility = true;

  @OneWay() className?: string;

  @OneWay() showInfo = false;

  @OneWay() infoText?: string;

  @OneWay() lightModeEnabled = false;

  @OneWay() maxPagesCount = 10;

  @OneWay() pageCount = 10;

  @OneWay() pagesCountText?: string;

  @OneWay() visible = true;

  @OneWay() hasKnownLastPage = true;

  @OneWay() pagesNavigatorVisible: boolean | 'auto' = 'auto';

  @TwoWay() pageIndex = 1;

  @Event() pageIndexChange?: EventCallback<number>;

  @TwoWay() pageSize = 5;

  @Event() pageSizeChange?: EventCallback<number>;

  @OneWay() showPageSizes = true;

  @OneWay() pageSizes = [5, 10];

  @OneWay() rtlEnabled = false;

  @OneWay() showNavigationButtons = false;

  @OneWay() totalCount = 0;
}
