import {
  Component, JSXComponent, ComponentBindings,
  Fragment, InternalState, Consumer, Effect,
} from '@devextreme-generator/declarations';
import {
  Plugins, PluginsContext,
} from '../../../../utils/plugin/context';
import { PlaceholderExtender } from '../../../../utils/plugin/placeholder_extender';
import { TopRowPlaceholder, BottomRowPlaceholder } from '../views/table_content';
import {
  TopVirtualRowHeightValue, BottomVirtualRowHeightValue,
  CalculateTopVirtualRowHeight, CalculateBottomVirtualRowHeight,
} from './plugins';
import { VirtualRow } from './virtual_row';
import {
  VisibleColumns,
} from '../data_grid_next';
import { GetterExtender } from '../../../../utils/plugin/getter_extender';

export const viewFunction = ({
  topHeight, bottomHeight, cellClasses,
}: VirtualContent): JSX.Element => (
  <Fragment>
    <GetterExtender
      type={TopVirtualRowHeightValue}
      order={0}
      value={CalculateTopVirtualRowHeight}
    />
    <GetterExtender
      type={BottomVirtualRowHeightValue}
      order={0}
      value={CalculateBottomVirtualRowHeight}
    />
    { topHeight > 0 && (
      <PlaceholderExtender
        type={TopRowPlaceholder}
        order={1}
        template={(): JSX.Element => (
          <VirtualRow
            height={topHeight}
            cellClasses={cellClasses}
            rowKey={-1}
          />
        )}
      />
    )}
    { bottomHeight > 0 && (
      <PlaceholderExtender
        type={BottomRowPlaceholder}
        order={1}
        template={(): JSX.Element => (
          <VirtualRow
            height={bottomHeight}
            cellClasses={cellClasses}
            rowKey={-2}
          />
        )}
      />
    )}
  </Fragment>
);

/* eslint-disable @typescript-eslint/no-extraneous-class */
@ComponentBindings()
export class VirtualContentProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualContent extends JSXComponent(VirtualContentProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  topHeight = 0;

  @InternalState()
  bottomHeight = 0;

  @InternalState()
  cellClasses: string[] = [];

  @Effect()
  watchVisibleColumns(): () => void {
    return this.plugins.watch(VisibleColumns, (visibleColumns) => {
      this.cellClasses = Array(visibleColumns.length).fill('').map((_, index) => visibleColumns[index].headerCssClass ?? '');
    });
  }

  @Effect()
  watchTopVirtualRowHeight(): () => void {
    return this.plugins.watch(TopVirtualRowHeightValue, (height) => {
      this.topHeight = height;
    });
  }

  @Effect()
  watchBottomVirtualRowHeight(): () => void {
    return this.plugins.watch(BottomVirtualRowHeightValue, (height) => {
      this.bottomHeight = height;
    });
  }
}
