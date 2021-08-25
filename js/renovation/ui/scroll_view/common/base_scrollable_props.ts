import {
  ComponentBindings, OneWay, Slot, Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback';
import { ScrollableDirection, ScrollableShowScrollbar, ScrollEventArgs } from './types.d';
import { touch } from '../../../../core/utils/support';
import { WidgetProps } from '../../common/widget';
import { getDefaultBounceEnabled, getDefaultUseNative, isDesktop } from '../utils/get_default_option_value';
import { current, isMaterial } from '../../../../ui/themes';
import messageLocalization from '../../../../localization/message';

@ComponentBindings()
export class BaseScrollableProps extends WidgetProps {
  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() useNative = getDefaultUseNative();

  @OneWay() addWidgetClass = false;

  @OneWay() direction: ScrollableDirection = 'vertical';

  @OneWay() showScrollbar: ScrollableShowScrollbar = isDesktop() ? 'onHover' : 'onScroll';

  @OneWay() bounceEnabled = getDefaultBounceEnabled();

  @OneWay() scrollByContent: boolean = isDesktop() ? touch : true;

  @OneWay() scrollByThumb = isDesktop();

  @OneWay() classes?: string;

  @OneWay() pullDownEnabled = false;

  @OneWay() reachBottomEnabled = false;

  @OneWay() forceGeneratePockets = false;

  @OneWay() needScrollViewContentWrapper = false;

  @OneWay() needScrollViewLoadPanel = false;

  @OneWay() needRenderScrollbars = true;

  @Event() onScroll?: EventCallback<ScrollEventArgs>;

  @Event() onUpdated?: EventCallback<ScrollEventArgs>;

  @Event() onPullDown?: EventCallback<unknown>;

  @Event() onReachBottom?: EventCallback<unknown>;

  @OneWay() pullingDownText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-pullingDownText');

  @OneWay() pulledDownText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-pulledDownText');

  @OneWay() refreshingText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-refreshingText');

  @OneWay() reachBottomText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-reachBottomText');
}
