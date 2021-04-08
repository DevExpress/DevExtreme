import {
  ComponentBindings,
} from '@devextreme-generator/declarations';

import {
  ScrollableProps,
} from './scrollable_props';

import { BaseWidgetProps } from '../common/base_props';

@ComponentBindings()
export class ScrollViewProps extends ScrollableProps {

}

export type ScrollViewPropsType = ScrollViewProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;
