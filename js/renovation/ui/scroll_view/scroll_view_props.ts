import {
  ComponentBindings,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

import {
  ScrollableProps,
} from './scrollable_props';

import BaseWidgetProps from '../../utils/base_props';
import messageLocalization from '../../../localization/message';

@ComponentBindings()
export class ScrollViewProps extends ScrollableProps {
  @OneWay() reachBottomText: string = messageLocalization.format('dxScrollView-reachBottomText');
}

export type ScrollViewPropsType = ScrollViewProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;
