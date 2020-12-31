import {
  ComponentBindings,
} from 'devextreme-generator/component_declaration/common';

import {
  ScrollableProps,
} from './scrollable_props';

import BaseWidgetProps from '../../utils/base_props';

@ComponentBindings()
export class ScrollViewProps extends ScrollableProps {

}

export type ScrollViewPropsType = ScrollViewProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;
