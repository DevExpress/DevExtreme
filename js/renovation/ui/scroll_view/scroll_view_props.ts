import {
  ComponentBindings,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

import messageLocalization from '../../../localization/message';

import {
  ScrollableProps,
} from './scrollable_props';

import {
  RefreshStrategy,
} from './types.d';

import BaseWidgetProps from '../../utils/base_props';

@ComponentBindings()
export class ScrollViewProps extends ScrollableProps {
  @OneWay() refreshStrategy: RefreshStrategy = 'pullDown';

  @OneWay() pullingDownText: string = messageLocalization.format('dxScrollView-pullingDownText');

  @OneWay() pulledDownText: string = messageLocalization.format('dxScrollView-pulledDownText');

  @OneWay() refreshingText: string = messageLocalization.format('dxScrollView-refreshingText');

  @OneWay() reachBottomText: string = messageLocalization.format('dxScrollView-reachBottomText');
}

export type ScrollViewPropsType = ScrollViewProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;
