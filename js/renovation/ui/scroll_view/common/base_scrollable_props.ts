import {
  ComponentBindings, OneWay, Event, Slot, Template, JSXTemplate,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback';
import { ScrollableDirection, ScrollEventArgs, RefreshStrategy } from './types';
import { touch } from '../../../../core/utils/support';
import { getDefaultBounceEnabled, isDesktop } from '../utils/get_default_option_value';
import { current, isMaterial } from '../../../../ui/themes';
import messageLocalization from '../../../../localization/message';
import { ScrollViewLoadPanelProps } from './scrollview_loadpanel_props';

@ComponentBindings()
export class BaseScrollableProps {
  @Template() loadPanelTemplate?: JSXTemplate<ScrollViewLoadPanelProps>;

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() aria?: Record<string, string> = {};

  @OneWay() addWidgetClass = false;

  @OneWay() disabled = false;

  @OneWay() height?: string | number | (() => (string | number));

  @OneWay() width?: string | number | (() => (string | number));

  @OneWay() visible = true;

  @OneWay() rtlEnabled?: boolean;

  @OneWay() classes?: string = '';

  @OneWay() direction: ScrollableDirection = 'vertical';

  @OneWay() bounceEnabled = getDefaultBounceEnabled();

  @OneWay() scrollByContent: boolean = isDesktop() ? touch : true;

  @OneWay() pullDownEnabled = false;

  @OneWay() reachBottomEnabled = false;

  @OneWay() forceGeneratePockets = false;

  @OneWay() needScrollViewContentWrapper = false;

  @OneWay() needRenderScrollbars = true;

  @Event() onScroll?: EventCallback<ScrollEventArgs>;

  @Event() onUpdated?: EventCallback<ScrollEventArgs>;

  @Event() onPullDown?: EventCallback<unknown>;

  @Event() onReachBottom?: EventCallback<unknown>;

  @OneWay() refreshStrategy: RefreshStrategy = 'simulated';

  @OneWay() pullingDownText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-pullingDownText');

  @OneWay() pulledDownText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-pulledDownText');

  @OneWay() refreshingText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-refreshingText');

  @OneWay() reachBottomText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-reachBottomText');
}
