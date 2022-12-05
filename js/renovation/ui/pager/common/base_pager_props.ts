import {
  ComponentBindings, OneWay, Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback';

import messageLocalization from '../../../../localization/message';

export type DisplayMode = 'adaptive' | 'compact' | 'full';

@ComponentBindings()
export class BasePagerProps {
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

  @OneWay() showPageSizes = true;

  @OneWay() pageSizes: (number | 'all')[] = [5, 10];

  @OneWay() rtlEnabled?: boolean;

  @OneWay() showNavigationButtons = false;

  @OneWay() totalCount = 0;

  @OneWay() label = messageLocalization.format('dxPager-ariaLabel');

  @Event() onKeyDown?: EventCallback<Event>;
}
