import {
  ComponentBindings, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback.d';

export type DisplayMode = 'adaptive' | 'compact' | 'full';

@ComponentBindings()
export class PagerProps {
  @OneWay() gridCompatibility = true;

  @OneWay() className?: string;

  @OneWay() showInfo = false;

  @OneWay() infoText?: string;

  @OneWay() lightModeEnabled?: boolean;

  @OneWay() displayMode: DisplayMode = 'adaptive';

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

  @OneWay() pageSizes: (number | 'all')[] = [5, 10];

  @OneWay() rtlEnabled?: boolean;

  @OneWay() showNavigationButtons = false;

  @OneWay() totalCount = 0;

  @Event() onKeyDown?: (e: any) => void;
}
