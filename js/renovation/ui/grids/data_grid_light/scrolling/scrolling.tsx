import {
  Component, JSXComponent, ComponentBindings,
  OneWay, Fragment,
} from '@devextreme-generator/declarations';
import { ValueSetter } from '../../../../utils/plugin/value_setter';
import { VirtualScrolling } from './virtual_scrolling';
import { ScrollingMode } from '../types';
import { ScrollingModeValue } from './plugins';

export const viewFunction = (viewModel: Scrolling): JSX.Element => (
  <Fragment>
    <ValueSetter type={ScrollingModeValue} value={viewModel.props.mode} />
    {viewModel.isVirtualScrolling && (<VirtualScrolling mode={viewModel.virtualScrollingMode} />)}
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
    return mode === 'virtual' || mode === 'infinite';
  }

  get virtualScrollingMode(): 'virtual' | 'infinite' {
    const { mode } = this.props;
    return mode === 'virtual' ? 'virtual' : 'infinite';
  }
}
