import {
  Component, JSXComponent, ComponentBindings,
  Consumer, Effect, OneWay, InternalState, Fragment,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';
import { PlaceholderExtender } from '../../../../utils/plugin/placeholder_extender';
import { RowsViewScroll, TopRowPlaceholder, BottomRowPlaceholder } from '../views/table_content';
import { VirtualRow } from './virtual_row';

export const viewFunction = (viewModel: Scrolling): JSX.Element => {
  const { topVirtualRowHeight, bottomVirtualRowHeight, visibleColumnCount } = viewModel;
  return (
    <Fragment>
      { topVirtualRowHeight > 0 && (
      <PlaceholderExtender
        type={TopRowPlaceholder}
        order={1}
        template={(): JSX.Element => (
          <VirtualRow height={topVirtualRowHeight} columnCount={visibleColumnCount} />
        )}
      />
      )}
      { bottomVirtualRowHeight > 0 && (
      <PlaceholderExtender
        type={BottomRowPlaceholder}
        order={1}
        template={(): JSX.Element => (
          <VirtualRow height={bottomVirtualRowHeight} columnCount={visibleColumnCount} />
        )}
      />
      )}
    </Fragment>
  );
};

@ComponentBindings()
export class ScrollingProps {
  @OneWay()
  mode: 'standard' | 'virtual' | 'infinite' = 'standard';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Scrolling extends JSXComponent(ScrollingProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  topVirtualRowHeight = 0;

  @InternalState()
  bottomVirtualRowHeight = 0;

  @InternalState()
  visibleColumnCount = 2;

  @Effect()
  setRowsViewScrollEvent(): void {
    this.plugins.set(RowsViewScroll, (offset) => {
      console.log(offset);
    });
  }
}
