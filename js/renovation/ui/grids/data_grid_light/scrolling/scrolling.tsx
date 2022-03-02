import {
  Component, JSXComponent, ComponentBindings,
  OneWay, Fragment,
} from '@devextreme-generator/declarations';
import { ValueSetter } from '../../../../utils/plugin/value_setter';
import { VirtualScrolling } from './virtual_scrolling';
import { ScrollingMode, VirtualScrollingMode } from '../types';
import { ScrollingModeValue } from './plugins';

export const viewFunction = ({
  isVirtualScrolling, virtualScrollingMode,
  props: {
    mode,
  },
}: Scrolling): JSX.Element => (
  <Fragment>
    <ValueSetter type={ScrollingModeValue} value={mode} />
    {isVirtualScrolling && (<VirtualScrolling mode={virtualScrollingMode} />)}
  </Fragment>
);

@ComponentBindings()
export class ScrollingProps {
  @OneWay()
  mode: ScrollingMode = 'standard';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Scrolling extends JSXComponent(ScrollingProps) {
  get isVirtualScrolling(): boolean {
    const { mode } = this.props;
    return mode !== 'standard';
  }

  get virtualScrollingMode(): VirtualScrollingMode {
    return this.props.mode as VirtualScrollingMode;
  }
}
