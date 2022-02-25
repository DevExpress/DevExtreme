import {
  Component, JSXComponent, ComponentBindings,
  Consumer, Effect, OneWay, InternalState, Fragment,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';
import { PlaceholderExtender } from '../../../../utils/plugin/placeholder_extender';
import { RowsViewScroll, TopRowPlaceholder, BottomRowPlaceholder } from '../views/table_content';
import { TotalCount, VisibleRows } from '../data_grid_light';
// import { PageIndex, PageSize } from '../data_grid_light/paging/plugins';
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

  @Effect()
  updateTotalCount(): () => void {
    return this.plugins.watch(TotalCount, () => {
      this.updateContent();
    });
  }

  updateContent(): void {
    const totalCount = this.plugins.getValue(TotalCount) ?? 0;
    const visibleRowCount = this.plugins.getValue(VisibleRows)?.length ?? 0;
    const rowHeight = 34;

    this.bottomVirtualRowHeight = (totalCount - visibleRowCount) * rowHeight;
  }
}
